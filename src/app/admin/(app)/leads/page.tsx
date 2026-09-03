import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { can } from "@/lib/permissions";
import { requiresAuth } from "@/lib/admin-guard";
import { LeadsManager, type LeadRow } from "@/components/admin/cms/leads-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Prospek — Admin" };

export default async function LeadsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; view?: string }>;
}) {
  const session = await requiresAuth();
  if (!can(session.user.role, "leads:read")) redirect("/admin/dashboard");

  const sp = await searchParams;
  const status = sp.status && sp.status !== "ALL" ? sp.status : "";
  const q = sp.q?.toLowerCase() ?? "";

  const where: Record<string, unknown> = { deletedAt: null };
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { companyName: { contains: q } },
      { email: { contains: q } },
      { referenceNumber: { contains: q } },
    ];
  }

  const [rows] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { service: { select: { name: true } }, assignee: { select: { name: true } } },
    }),
  ]);

  const leads: LeadRow[] = rows.map((r) => ({
    id: r.id,
    referenceNumber: r.referenceNumber,
    name: r.name,
    companyName: r.companyName,
    email: r.email,
    whatsapp: r.whatsapp,
    preferredContact: r.preferredContact,
    serviceName: r.service?.name ?? null,
    goal: r.goal,
    budgetRange: r.budgetRange,
    status: r.status,
    isRead: r.isRead,
    assigneeName: r.assignee?.name ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Prospek</h1>
          <p className="mt-1 text-sm text-ink/60">Kelola project brief yang masuk di satu tempat.</p>
        </div>
      </div>
      <div className="mt-5">
        <LeadsManager
          leads={leads}
          query={{
            status: sp.status ?? "ALL",
            q: sp.q ?? "",
            view: sp.view === "kanban" ? "kanban" : "table",
          }}
        />
      </div>
    </div>
  );
}
