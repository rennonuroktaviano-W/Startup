import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requiresAuth } from "@/lib/admin-guard";
import { ClientForm } from "@/components/admin/cms/client-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Klien — Admin" };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requiresAuth();
  const { id } = await params;
  const c = await prisma.client.findUnique({ where: { id } });
  if (!c) notFound();
  const logo = c.logoMediaId ? await prisma.mediaAsset.findUnique({ where: { id: c.logoMediaId } }) : null;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit Klien</h1>
      <ClientForm
        initial={{
          id: c.id,
          name: c.name,
          websiteUrl: c.websiteUrl,
          isPublic: c.isPublic,
          sortOrder: c.sortOrder,
          logoMediaId: c.logoMediaId,
          logoUrl: logo?.publicUrl ?? null,
        }}
      />
    </div>
  );
}
