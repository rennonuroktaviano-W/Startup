"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { upsertRedirect } from "@/lib/redirects";

const pageSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(2),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda minus.")
    .max(80),
  pageType: z.enum(["GENERIC", "HOME", "SERVICES", "WORK", "ABOUT", "PROCESS", "INSIGHTS", "CONTACT", "LEGAL"]).default("GENERIC"),
  status: z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional().nullable(),
  noIndex: z.boolean().optional(),
});

export async function upsertPage(input: z.infer<typeof pageSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = pageSchema.parse(input);
  const { id, ...rest } = p;
  const canonical = rest.canonicalUrl?.trim() || null;
  const data = {
    title: rest.title,
    slug: rest.slug,
    pageType: rest.pageType,
    status: rest.status,
    metaTitle: rest.metaTitle ?? null,
    metaDescription: rest.metaDescription ?? null,
    canonicalUrl: canonical,
    noIndex: rest.noIndex ?? false,
  };

  const record = id ? await prisma.page.update({ where: { id }, data }) : await prisma.page.create({ data });

  if (id) {
    const prev = await prisma.page.findUnique({ where: { id }, select: { slug: true } });
    if (prev && prev.slug !== record.slug) {
      await upsertRedirect(`/pages/${prev.slug}`, `/pages/${record.slug}`);
    }
  }

  await logAudit({
    actorId: session.user.id,
    action: id ? "update" : "create",
    entityType: "Page",
    entityId: record.id,
    summary: { title: data.title, status: data.status },
  });
  return { ok: true, id: record.id };
}

export async function deletePage(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.page.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Page", entityId: id });
  return { ok: true };
}

// --- SECTIONS ---

const sectionSchema = z.object({
  id: z.string().cuid().optional(),
  pageId: z.string().cuid().min(1),
  sectionType: z.enum(["hero", "text", "grid", "cta", "faq", "split", "gallery"]),
  variant: z.string().optional(),
  contentJson: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isVisible: z.boolean().optional(),
});

export async function upsertPageSection(input: z.infer<typeof sectionSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const { id, ...rest } = sectionSchema.parse(input);
  let content = {};
  if (rest.contentJson) {
    const parsed = JSON.parse(rest.contentJson);
    if (parsed && typeof parsed === "object") content = parsed;
  }
  const record = id
    ? await prisma.pageSection.update({
        where: { id },
        data: {
          sectionType: rest.sectionType,
          variant: rest.variant ?? "default",
          contentJson: content as never,
          sortOrder: rest.sortOrder ?? 0,
          isVisible: rest.isVisible ?? true,
        },
      })
    : await prisma.pageSection.create({
        data: {
          pageId: rest.pageId,
          sectionType: rest.sectionType,
          variant: rest.variant ?? "default",
          contentJson: content as never,
          sortOrder: rest.sortOrder ?? 0,
          isVisible: rest.isVisible ?? true,
        },
      });
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "PageSection", entityId: record.id });
  return { ok: true, id: record.id };
}

export async function deletePageSection(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.pageSection.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "PageSection", entityId: id });
  return { ok: true };
}

export async function reorderSections(pageId: string, orderedIds: string[]) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.pageSection.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
  await logAudit({ actorId: session.user.id, action: "update", entityType: "PageSection", entityId: pageId, summary: { reorder: orderedIds } });
  return { ok: true };
}