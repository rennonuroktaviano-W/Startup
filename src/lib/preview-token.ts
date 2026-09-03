import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

export type PreviewEntityType = "BlogPost" | "Project" | "Service";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function createPreviewToken(
  entityType: PreviewEntityType,
  entityId: string,
): Promise<string> {
  const token = randomBytes(24).toString("hex");
  await prisma.previewToken.create({
    data: {
      tokenHash: sha256(token),
      entityType,
      entityId,
      expiresAt: new Date(Date.now() + TTL_MS),
    },
  });
  return token;
}

export async function resolvePreviewToken(token: string) {
  const record = await prisma.previewToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!record) return null;
  if (new Date(record.expiresAt) < new Date()) return null;
  if (record.revokedAt) return null;
  return record;
}