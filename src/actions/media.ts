"use server";

import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";

export async function deleteMedia(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "media:write");
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { ok: false, error: "File tidak ditemukan." };
  try {
    await unlink(join(process.cwd(), "public", "uploads", asset.fileName));
  } catch { /* file may already be gone */ }
  await prisma.mediaAsset.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Media", entityId: id, summary: { fileName: asset.fileName } });
  return { ok: true };
}