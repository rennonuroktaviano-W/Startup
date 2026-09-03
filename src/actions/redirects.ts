"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

const redirectSchema = z.object({
  id: z.string().cuid().optional(),
  sourcePath: z
    .string()
    .min(1)
    .startsWith("/", "Path sumber harus diawali '/'")
    .regex(/^\/[a-zA-Z0-9\-/]*$/, "Path sumber hanya boleh huruf, angka, minus, dan slash."),
  destinationUrl: z.string().min(1, "URL tujuan wajib diisi."),
  statusCode: z.coerce.number().refine((v) => v === 301 || v === 302, { message: "Status harus 301 atau 302." }),
  isActive: z.boolean().optional(),
});

export async function upsertRedirect(input: z.infer<typeof redirectSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  const { id, ...rest } = redirectSchema.parse(input);
  const record = id
    ? await prisma.redirect.update({ where: { id }, data: rest as never })
    : await prisma.redirect.create({ data: rest as never });
  await logAudit({
    actorId: session.user.id,
    action: id ? "update" : "create",
    entityType: "Redirect",
    entityId: record.id,
    summary: { sourcePath: rest.sourcePath, destinationUrl: rest.destinationUrl },
  });
  return { ok: true, id: record.id };
}

export async function toggleRedirect(id: string, isActive: boolean) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.redirect.update({ where: { id }, data: { isActive } });
  await logAudit({ actorId: session.user.id, action: "update", entityType: "Redirect", entityId: id, summary: { isActive } });
  return { ok: true };
}

export async function deleteRedirect(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "settings:write");
  await prisma.redirect.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Redirect", entityId: id });
  return { ok: true };
}