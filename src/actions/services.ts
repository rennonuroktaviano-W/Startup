"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { saveRevision } from "@/lib/revisions";
import { upsertRedirect } from "@/lib/redirects";
import { validateForPublish } from "@/features/publishing/validate";

const serviceSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(2, "Nama minimal 2 karakter."),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  bodyJson: z.string().optional(),
  priceMode: z.enum(["BY_SCOPE", "PRICED"]).optional(),
  timelineText: z.string().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function upsertService(input: z.infer<typeof serviceSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");

  const parsed = serviceSchema.parse(input);
  const { id, ...rest } = parsed;

  const data = {
    name: rest.name,
    slug: rest.slug ?? slugify(rest.name),
    shortDescription: rest.shortDescription ?? "",
    bodyJson: (rest.bodyJson ? JSON.parse(rest.bodyJson) : undefined) as never,
    priceMode: rest.priceMode ?? "BY_SCOPE",
    timelineText: rest.timelineText,
    isFeatured: rest.isFeatured ?? false,
    sortOrder: rest.sortOrder ?? 0,
    status: rest.status ?? "DRAFT",
    metaTitle: rest.metaTitle,
    metaDescription: rest.metaDescription,
  };

  const record = id
    ? await prisma.service.update({ where: { id }, data })
    : await prisma.service.create({ data });

  if (id) {
    const prev = await prisma.service.findUnique({ where: { id }, select: { slug: true } });
    if (prev && prev.slug !== record.slug) {
      await upsertRedirect(`/services/${prev.slug}`, `/services/${record.slug}`);
    }
  }

  await logAudit({
    actorId: session.user.id,
    action: id ? "update" : "create",
    entityType: "Service",
    entityId: record.id,
    summary: { name: data.name, status: data.status },
  });
  await saveRevision("Service", record.id, session.user.id, { ...data, bodyJson: data.bodyJson ?? null });
  return { ok: true, id: record.id };
}

export async function deleteService(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.service.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Service", entityId: id });
  return { ok: true };
}

export async function togglePublishService(id: string, status: "DRAFT" | "PUBLISHED") {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:publish");
  const record = await prisma.service.findUnique({ where: { id } });
  if (!record) return { ok: false as const, message: "Layanan tidak ditemukan." };
  if (status === "PUBLISHED") {
    const issues = validateForPublish(record, ["name", "slug", "shortDescription", "metaTitle"]);
    if (issues.length > 0) {
      return { ok: false as const, message: "Belum bisa diterbitkan: " + issues.map((i) => i.field).join(", ") + " belum lengkap." };
    }
  }
  const updated = await prisma.service.update({ where: { id }, data: { status } });
  await logAudit({ actorId: session.user.id, action: "publish", entityType: "Service", entityId: id, summary: { status } });
  return { ok: true as const, status: updated.status };
}