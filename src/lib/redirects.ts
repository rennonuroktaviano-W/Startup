import "server-only";

import { prisma } from "@/lib/db";

/**
 * Mencatat redirect 301 dari path lama ke path baru saat slug konten berubah.
 * idempoten: jika sourcePath sudah ada, update destination; kalau belum, buat baru.
 */
export async function upsertRedirect(
  sourcePath: string,
  destinationUrl: string,
  statusCode: number = 301,
): Promise<void> {
  if (!sourcePath.startsWith("/") || sourcePath === "/" || sourcePath === destinationUrl) return;
  await prisma.redirect.upsert({
    where: { sourcePath },
    create: { sourcePath, destinationUrl, statusCode, isActive: true },
    update: { destinationUrl, statusCode, isActive: true },
  });
}