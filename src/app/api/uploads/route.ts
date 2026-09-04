import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";
import { getSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "ico", "pdf", "mp4", "webm"]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  requireCapability(session.user.role, "content:read");

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();

  const assets = await prisma.mediaAsset.findMany({
    where: q
      ? { OR: [{ fileName: { contains: q } }, { originalName: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(
    assets.map((a) => ({
      id: a.id,
      name: a.originalName,
      url: a.publicUrl ?? `/uploads/${a.fileName}`,
      size: a.sizeBytes,
      modifiedAt: a.createdAt.toISOString(),
      altText: a.altText,
      caption: a.caption,
    })),
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  requireCapability(session.user.role, "media:write");

  const rl = await rateLimit({ key: "media-upload", limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Terlalu banyak upload. Coba lagi sebentar." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "File wajib." }, { status: 400 });
  const ext = extname(file.name).replace(".", "").toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return NextResponse.json({ error: `Ekstensi .${ext} tidak diizinkan.` }, { status: 400 });

  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > 10 * 1024 * 1024) return NextResponse.json({ error: "Ukuran maks 10 MB." }, { status: 400 });

  const src = join(UPLOAD_DIR, fileName);
  await writeFile(src, buffer);

  const altText = formData.get("altText")?.toString() ?? null;
  const caption = formData.get("caption")?.toString() ?? null;

  const { prisma } = await import("@/lib/db");
  const asset = await prisma.mediaAsset.create({
    data: {
      fileName,
      originalName: file.name,
      mimeType: file.type || `image/${ext}`,
      sizeBytes: buffer.length,
      storageKey: `uploads/${fileName}`,
      publicUrl: `/uploads/${fileName}`,
      altText,
      caption,
      uploadedBy: session.user.id,
    },
  });

  await logAudit({
    actorId: session.user.id,
    action: "create",
    entityType: "Media",
    entityId: asset.id,
    summary: { fileName, originalName: file.name, sizeBytes: buffer.length },
  });

  return NextResponse.json({
    id: asset.id,
    url: `/uploads/${fileName}`,
    name: file.name,
    size: buffer.length,
    type: file.type,
  });
}