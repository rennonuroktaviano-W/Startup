import { NextResponse } from "next/server";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const STORAGE_DIR = join(process.cwd(), "private", "attachments");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ inquiryId: string; attachmentId: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  requireCapability(session.user.role, "leads:read");

  const { inquiryId, attachmentId } = await params;
  const attachment = await prisma.inquiryAttachment.findFirst({
    where: { id: attachmentId, inquiryId },
  });
  if (!attachment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let fileName: string | null = null;
  try {
    const entries = await readdir(STORAGE_DIR);
    fileName = entries.find((f) => f.startsWith(attachment.privateStorageKey + ".")) ?? null;
  } catch {
    fileName = null;
  }
  if (!fileName) return NextResponse.json({ error: "File tidak ditemukan." }, { status: 404 });

  const buffer = await readFile(join(STORAGE_DIR, fileName));
  const safeName = attachment.originalName.replace(/["\\]/g, "");

  await logAudit({
    actorId: session.user.id,
    action: "attachment_download",
    entityType: "InquiryAttachment",
    entityId: attachment.id,
    summary: { originalName: safeName, sizeBytes: buffer.length },
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": attachment.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "no-store",
    },
  });
}