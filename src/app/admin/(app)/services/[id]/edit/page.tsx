import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ServiceForm } from "@/components/admin/cms/service-form";
import { RevisionHistory } from "@/components/admin/cms/revision-history";
import { listRevisions } from "@/lib/revisions";
import { PreviewLink } from "@/components/admin/cms/preview-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id }, select: { name: true } });
  return { title: service ? `Edit ${service.name} — Admin` : "Layanan tidak ditemukan" };
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  const revisions = await listRevisions("Service", id);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit: {service.name}</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <ServiceForm
          initial={{
            id: service.id,
            name: service.name,
            shortDescription: service.shortDescription,
            bodyJson: JSON.stringify(service.bodyJson ?? {}, null, 2),
            priceMode: service.priceMode as "BY_SCOPE" | "PRICED",
            isFeatured: service.isFeatured,
            status: service.status,
            metaTitle: service.metaTitle ?? "",
            metaDescription: service.metaDescription ?? "",
          }}
        />
      </div>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <PreviewLink entityType="Service" entityId={service.id} />
      </div>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <RevisionHistory
          revisions={revisions.map((r) => ({
            id: r.id,
            versionNumber: r.versionNumber,
            createdAt: r.createdAt,
            author: r.author,
          }))}
        />
      </div>
    </div>
  );
}