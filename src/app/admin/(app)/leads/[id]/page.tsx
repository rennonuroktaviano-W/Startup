import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { can } from "@/lib/permissions";
import { requiresAuth } from "@/lib/admin-guard";
import { parseScopeJson, parseAssetsJson } from "@/lib/leads";
import { LeadDetail } from "@/components/admin/cms/lead-detail";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detail Prospek — Admin" };

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requiresAuth();
  if (!can(session.user.role, "leads:read")) redirect("/admin/dashboard");

  const { id } = await params;
  const lead = await prisma.inquiry.findUnique({
    where: { id },
    include: { service: { select: { name: true } } },
  });

  if (!lead) notFound();

  const [notes, activities, team] = await Promise.all([
    prisma.inquiryNote.findMany({
      where: { inquiryId: id },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inquiryActivity.findMany({
      where: { inquiryId: id },
      include: { actor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const scope = parseScopeJson(lead.scopeJson);
  const assets = parseAssetsJson(lead.assetsStateJson);

  return (
    <div className="mx-auto max-w-6xl">
      <LeadDetail
        lead={{
          id: lead.id,
          referenceNumber: lead.referenceNumber,
          name: lead.name,
          companyName: lead.companyName,
          email: lead.email,
          whatsapp: lead.whatsapp,
          preferredContact: lead.preferredContact,
          serviceName: lead.service?.name ?? null,
          goal: lead.goal,
          description: lead.description,
          features: scope.features,
          referenceUrl: scope.referenceUrl,
          targetDate: scope.targetDate,
          assets,
          budgetRange: lead.budgetRange,
          status: lead.status,
          isRead: lead.isRead,
          assigneeId: lead.assigneeId,
          lostReason: lead.lostReason,
          source: lead.source,
          consentAt: lead.consentAt.toISOString(),
          createdAt: lead.createdAt.toISOString(),
          archivedAt: lead.deletedAt?.toISOString() ?? null,
          lastContactedAt: lead.lastContactedAt?.toISOString() ?? null,
        }}
        notes={notes.map((n) => ({
          id: n.id,
          body: n.body,
          isPinned: n.isPinned,
          authorName: n.author?.name ?? null,
          createdAt: n.createdAt.toISOString(),
        }))}
        activities={activities.map((a) => ({
          id: a.id,
          action: a.action,
          actorName: a.actor?.name ?? null,
          createdAt: a.createdAt.toISOString(),
        }))}
        team={team.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  );
}
