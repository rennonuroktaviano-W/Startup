"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { saveRevision } from "@/lib/revisions";
import { upsertRedirect } from "@/lib/redirects";

const projectSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  projectType: z.enum(["CONCEPT", "CLIENT"]).optional(),
  clientId: z.string().cuid().optional().nullable(),
  industry: z.string().optional().nullable(),
  year: z.coerce.number().optional().nullable(),
  summary: z.string().optional(),
  challengeJson: z.string().optional(),
  goalsJson: z.string().optional(),
  approachJson: z.string().optional(),
  highlightsJson: z.string().optional(),
  outcomeJson: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  serviceIds: z.string().array().optional(),
});

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function parseJson(text?: string) {
  if (!text) return [];
  try {
    return JSON.parse(text) as never;
  } catch {
    return [];
  }
}

export async function upsertProject(input: z.infer<typeof projectSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = projectSchema.parse(input);
  const { id, serviceIds, ...rest } = p;

  const data = {
    title: rest.title,
    slug: rest.slug ?? slugify(rest.title),
    projectType: rest.projectType ?? "CONCEPT",
    clientId: rest.clientId ?? null,
    industry: rest.industry ?? null,
    year: rest.year ?? null,
    summary: rest.summary ?? null,
    challengeJson: parseJson(rest.challengeJson),
    goalsJson: parseJson(rest.goalsJson),
    approachJson: parseJson(rest.approachJson),
    highlightsJson: rest.highlightsJson ? parseJson(rest.highlightsJson) : undefined,
    outcomeJson: parseJson(rest.outcomeJson),
    isFeatured: rest.isFeatured ?? false,
    status: rest.status ?? "DRAFT",
    metaTitle: rest.metaTitle ?? null,
    metaDescription: rest.metaDescription ?? null,
  };

  const record = id
    ? await prisma.project.update({ where: { id }, data })
    : await prisma.project.create({ data });

  if (id) {
    const prev = await prisma.project.findUnique({ where: { id }, select: { slug: true } });
    if (prev && prev.slug !== record.slug) {
      await upsertRedirect(`/work/${prev.slug}`, `/work/${record.slug}`);
    }
  }

  if (serviceIds) {
    await prisma.projectService.deleteMany({ where: { projectId: record.id } });
    if (serviceIds.length) {
      await prisma.projectService.createMany({ data: serviceIds.map((s) => ({ projectId: record.id, serviceId: s })) });
    }
  }

  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "Project", entityId: record.id, summary: { title: data.title, status: data.status } });
  await saveRevision("Project", record.id, session.user.id, { ...data, serviceIds: serviceIds ?? [] });
  return { ok: true, id: record.id };
}

export async function deleteProject(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.project.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Project", entityId: id });
  return { ok: true };
}

export async function togglePublishProject(id: string, status: "DRAFT" | "PUBLISHED") {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:publish");
  const updated = await prisma.project.update({ where: { id }, data: { status } });
  await logAudit({ actorId: session.user.id, action: "publish", entityType: "Project", entityId: id, summary: { status } });
  return { ok: true, status: updated.status };
}