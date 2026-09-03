"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { listRevisions, getRevisionById, applyRestore, type RevisionEntity } from "@/lib/revisions";
import { createPreviewToken, type PreviewEntityType } from "@/lib/preview-token";

export async function fetchRevisions(entityType: RevisionEntity, entityId: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:read");
  return listRevisions(entityType, entityId);
}

export async function viewRevision(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:read");
  const rev = await getRevisionById(id);
  if (!rev) return { ok: false } as const;
  await logAudit({
    actorId: session.user.id,
    action: "preview",
    entityType: rev.entityType,
    entityId: rev.entityId,
    summary: { revisionId: rev.id, versionNumber: rev.versionNumber },
  });
  return { ok: true, snapshot: rev.snapshotJson, versionNumber: rev.versionNumber } as const;
}

export async function restoreRevision(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const rev = await getRevisionById(id);
  if (!rev) return { ok: false, error: "Revision tidak ditemukan." } as const;

  const snap = rev.snapshotJson as Record<string, unknown>;
  const status = (snap.status as string) ?? "DRAFT";

  switch (rev.entityType) {
    case "BlogPost": {
      const categoryIds = (snap.categoryIds as string[]) ?? [];
      const tagIds = (snap.tagIds as string[]) ?? [];
      const data = {
        title: snap.title as string,
        slug: snap.slug as string,
        excerpt: (snap.excerpt as string) ?? null,
        bodyJson: (snap.bodyJson ?? {}) as never,
        status: status as never,
        publishedAt: snap.publishedAt ? new Date(snap.publishedAt as string) : null,
        scheduledAt: snap.scheduledAt ? new Date(snap.scheduledAt as string) : null,
        readingMinutes: (snap.readingMinutes as number | null) ?? null,
        metaTitle: (snap.metaTitle as string) ?? null,
        metaDescription: (snap.metaDescription as string) ?? null,
        featuredMediaId: (snap.featuredMediaId as string | null) ?? null,
        noIndex: (snap.noIndex as boolean) ?? false,
      };
      await applyRestore("BlogPost", rev.entityId, snap, session.user.id, async () => {
        const updated = await prisma.blogPost.update({ where: { id: rev.entityId }, data });
        await prisma.postCategory.deleteMany({ where: { postId: rev.entityId } });
        if (categoryIds.length) await prisma.postCategory.createMany({ data: categoryIds.map((c) => ({ postId: rev.entityId, categoryId: c })) });
        await prisma.postTag.deleteMany({ where: { postId: rev.entityId } });
        if (tagIds.length) await prisma.postTag.createMany({ data: tagIds.map((t) => ({ postId: rev.entityId, tagId: t })) });
        revalidatePath(`/blog/${updated.slug}`);
        revalidatePath("/insights");
      });
      break;
    }
    case "Project": {
      const serviceIds = (snap.serviceIds as string[]) ?? [];
      const data = {
        title: snap.title as string,
        slug: snap.slug as string,
        projectType: (snap.projectType as never) ?? "CONCEPT",
        clientId: (snap.clientId as string | null) ?? null,
        industry: (snap.industry as string | null) ?? null,
        year: (snap.year as number | null) ?? null,
        summary: (snap.summary as string | null) ?? null,
        challengeJson: (snap.challengeJson ?? []) as never,
        goalsJson: (snap.goalsJson ?? []) as never,
        approachJson: (snap.approachJson ?? []) as never,
        highlightsJson: (snap.highlightsJson ?? []) as never,
        outcomeJson: (snap.outcomeJson ?? []) as never,
        isFeatured: (snap.isFeatured as boolean) ?? false,
        status: (snap.status as never) ?? "DRAFT",
        metaTitle: (snap.metaTitle as string | null) ?? null,
        metaDescription: (snap.metaDescription as string | null) ?? null,
      };
      await applyRestore("Project", rev.entityId, snap, session.user.id, async () => {
        const updated = await prisma.project.update({ where: { id: rev.entityId }, data });
        await prisma.projectService.deleteMany({ where: { projectId: rev.entityId } });
        if (serviceIds.length) await prisma.projectService.createMany({ data: serviceIds.map((s) => ({ projectId: rev.entityId, serviceId: s })) });
        revalidatePath(`/work/${updated.slug}`);
        revalidatePath("/work");
      });
      break;
    }
    case "Service": {
      const data = {
        name: snap.name as string,
        slug: snap.slug as string,
        shortDescription: (snap.shortDescription as string) ?? "",
        bodyJson: (snap.bodyJson ?? {}) as never,
        priceMode: (snap.priceMode as never) ?? "BY_SCOPE",
        timelineText: (snap.timelineText as string) ?? null,
        isFeatured: (snap.isFeatured as boolean) ?? false,
        sortOrder: (snap.sortOrder as number) ?? 0,
        status: (snap.status as never) ?? "DRAFT",
        metaTitle: (snap.metaTitle as string) ?? null,
        metaDescription: (snap.metaDescription as string) ?? null,
      };
      await applyRestore("Service", rev.entityId, snap, session.user.id, async () => {
        const updated = await prisma.service.update({ where: { id: rev.entityId }, data });
        revalidatePath(`/services/${updated.slug}`);
      });
      break;
    }
    default:
      return { ok: false, error: `Tipe ${rev.entityType} belum didukung restore.` } as const;
  }

  await logAudit({
    actorId: session.user.id,
    action: "restore",
    entityType: rev.entityType,
    entityId: rev.entityId,
    summary: { revisionId: rev.id, fromVersion: rev.versionNumber },
  });
  return { ok: true } as const;
}

export async function generatePreviewLink(entityType: PreviewEntityType, entityId: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:publish");
  const host = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const token = await createPreviewToken(entityType, entityId);
  await logAudit({
    actorId: session.user.id,
    action: "preview",
    entityType,
    entityId,
    summary: { tokenHash: token },
  });
  // Token acak & kedaluwarsa; cukup disimpan hash-nya di DB.
  return { ok: true, url: `${host}/preview/${token}`, token } as const;
}