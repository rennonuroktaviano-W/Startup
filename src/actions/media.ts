"use server";

import { unlink, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "ico", "pdf", "mp4", "webm"]);

export async function replaceMedia(
  id: string,
  file: File,
  altText?: string | null,
  caption?: string | null,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "media:write");
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { ok: false, error: "File tidak ditemukan." };

  const ext = extname(file.name).replace(".", "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return { ok: false, error: `Ekstensi .${ext} tidak diizinkan.` };
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > 10 * 1024 * 1024) return { ok: false, error: "Ukuran maks 10 MB." };

  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  await writeFile(join(UPLOAD_DIR, fileName), buffer);

  // Hapus file lama setelah file baru berhasil ditulis.
  try {
    await unlink(join(UPLOAD_DIR, asset.fileName));
  } catch { /* file may already be gone */ }

  await prisma.mediaAsset.update({
    where: { id },
    data: {
      fileName,
      originalName: file.name,
      mimeType: file.type || `image/${ext}`,
      sizeBytes: buffer.length,
      storageKey: `uploads/${fileName}`,
      publicUrl: `/uploads/${fileName}`,
      altText: altText ?? asset.altText,
      caption: caption ?? asset.caption,
    },
  });

  await logAudit({
    actorId: session.user.id,
    action: "update",
    entityType: "Media",
    entityId: id,
    summary: { oldFile: asset.fileName, newFile: fileName, originalName: file.name, sizeBytes: buffer.length },
  });

  return { ok: true, url: `/uploads/${fileName}` };
}

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