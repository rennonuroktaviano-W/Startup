import "server-only";

import { prisma } from "@/lib/db";

export type RevisionEntity =
  | "BlogPost"
  | "Project"
  | "Service"
  | "Faq"
  | "Page";

export async function saveRevision(
  entityType: RevisionEntity,
  entityId: string,
  actorId: string | null | undefined,
  snapshot: unknown,
): Promise<void> {
  const last = await prisma.contentRevision.findFirst({
    where: { entityType, entityId },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });
  await prisma.contentRevision.create({
    data: {
      entityType,
      entityId,
      snapshotJson: snapshot as never,
      versionNumber: (last?.versionNumber ?? 0) + 1,
      createdBy: actorId ?? null,
    },
  });
}

export async function listRevisions(entityType: RevisionEntity, entityId: string) {
  return prisma.contentRevision.findMany({
    where: { entityType, entityId },
    orderBy: { versionNumber: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });
}

export async function getRevisionById(id: string) {
  return prisma.contentRevision.findUnique({ where: { id } });
}

/**
 * Restore jadikan snapshot revision sebagai nilai yang diterapkan oleh `apply`.
 * `apply` bertanggung jawab menulis data kembali ke entitas (tipenya berbeda tiap
 * entitas), sedangkan helper ini hanya mengelola versioning + audit + revalidation.
 */
export async function applyRestore(
  entityType: RevisionEntity,
  entityId: string,
  snapshot: unknown,
  actorId: string,
  apply: () => Promise<void>,
): Promise<void> {
  await apply();
  await saveRevision(entityType, entityId, actorId, snapshot);
}