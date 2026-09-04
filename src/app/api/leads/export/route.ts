import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { LEAD_STATUS_META, parseScopeJson, parseAssetsJson } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "leads:export");

  const rl = await rateLimit({ key: "leads-export", limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Terlalu banyak export. Coba lagi sebentar." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.toLowerCase();

  const where: Record<string, unknown> = { deletedAt: null };
  if (status && status !== "ALL") where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { companyName: { contains: q } },
      { email: { contains: q } },
      { referenceNumber: { contains: q } },
    ];
  }

  const leads = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { service: { select: { name: true } }, assignee: { select: { name: true } } },
  });

  await logAudit({
    actorId: session.user.id,
    action: "lead_export",
    entityType: "Inquiry",
    summary: { count: leads.length, status: status ?? "ALL" },
  });

  const rows = leads.map((l) => {
    const scope = parseScopeJson(l.scopeJson);
    const assets = parseAssetsJson(l.assetsStateJson);
    return {
      Reference: l.referenceNumber,
      Nama: l.name,
      Perusahaan: l.companyName ?? "",
      Email: l.email,
      WhatsApp: l.whatsapp ?? "",
      "Kontak Pilihan": l.preferredContact,
      Layanan: l.service?.name ?? "",
      Tujuan: l.goal ?? "",
      Deskripsi: l.description,
      Fitur: scope.features.join("; "),
      "URL Referensi": scope.referenceUrl ?? "",
      "Target Waktu": scope.targetDate ?? "",
      Aset: assets.join("; "),
      Budget: l.budgetRange ?? "",
      Status: (LEAD_STATUS_META[l.status]?.label ?? l.status),
      "Dibaca?": l.isRead ? "Ya" : "Tidak",
      "Penanggung Jawab": l.assignee?.name ?? "",
      "Alasan Kalah": l.lostReason ?? "",
      Source: l.source ?? "",
      Tanggal: l.createdAt.toISOString(),
    };
  });

  const headers = Object.keys(rows[0] ?? {});
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h as keyof typeof r] ?? "")).join(","))].join("\n");

  return new NextResponse(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prospek-kotakide-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
