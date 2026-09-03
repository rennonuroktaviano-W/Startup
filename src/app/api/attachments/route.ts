import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const STORAGE_DIR = join(process.cwd(), "private", "attachments");
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx", "ppt", "pptx", "zip"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 3;

export async function POST(request: Request) {
  const rl = await rateLimit({ key: "attachment-upload", limit: 10, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Terlalu banyak unggahan. Coba lagi nanti." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Format upload tidak valid." }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "Tidak ada file." }, { status: 400 });
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Maksimal ${MAX_FILES} file.` }, { status: 400 });

  await mkdir(STORAGE_DIR, { recursive: true });

  const descriptors: { uploadId: string; originalName: string; mimeType: string; sizeBytes: number }[] = [];

  for (const file of files) {
    const ext = extname(file.name).replace(".", "").toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: `Tipe file .${ext} tidak diizinkan.` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File ${file.name} melebihi 5 MB.` }, { status: 400 });
    }

    const uploadId = randomBytes(9).toString("hex");
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(STORAGE_DIR, `${uploadId}.${ext}`), buffer);

    descriptors.push({
      uploadId,
      originalName: file.name,
      mimeType: file.type || `application/${ext}`,
      sizeBytes: buffer.length,
    });
  }

  return NextResponse.json({ ok: true, files: descriptors });
}