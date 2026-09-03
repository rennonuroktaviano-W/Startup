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

  const [pages, services, projects, blogs, clients, team, testimonials, projectMedia, inquiryAttachments] =
    await Promise.all([
      prisma.page.count({ where: { ogMediaId: id } }),
      prisma.service.count({ where: { ogMediaId: id } }),
      prisma.project.count({ where: { OR: [{ ogMediaId: id }, { coverMediaId: id }] } }),
      prisma.blogPost.count({ where: { OR: [{ ogMediaId: id }, { featuredMediaId: id }] } }),
      prisma.client.count({ where: { logoMediaId: id } }),
      prisma.teamMember.count({ where: { photoMediaId: id } }),
      prisma.testimonial.count({ where: { avatarMediaId: id } }),
      prisma.projectMedia.count({ where: { mediaId: id } }),
      prisma.inquiryAttachment.count({ where: { mediaId: id } }),
    ]);

  const deps: string[] = [];
  if (pages) deps.push(`Halaman (${pages})`);
  if (services) deps.push(`Layanan (${services})`);
  if (projects) deps.push(`Proyek (${projects})`);
  if (blogs) deps.push(`Artikel (${blogs})`);
  if (clients) deps.push(`Klien (${clients})`);
  if (team) deps.push(`Tim (${team})`);
  if (testimonials) deps.push(`Testimoni (${testimonials})`);
  if (projectMedia) deps.push(`Galeri (${projectMedia})`);
  if (inquiryAttachments) deps.push(`Lampiran (${inquiryAttachments})`);

  if (deps.length) {
    return {
      ok: false,
      error: "File masih digunakan dan tidak bisa dihapus.",
      dependencies: deps,
    };
  }

  try {
    await unlink(join(process.cwd(), "public", "uploads", asset.fileName));
  } catch { /* file may already be gone */ }
  await prisma.mediaAsset.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Media", entityId: id, summary: { fileName: asset.fileName } });
  return { ok: true };
}