import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requiresAuth } from "@/lib/admin-guard";
import { TestimonialForm } from "@/components/admin/cms/testimonial-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Testimoni — Admin" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  await requiresAuth();
  const { id } = await params;
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) notFound();

  const avatar = t.avatarMediaId ? await prisma.mediaAsset.findUnique({ where: { id: t.avatarMediaId } }) : null;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit Testimoni</h1>
      <TestimonialForm
        initial={{
          id: t.id,
          personName: t.personName,
          jobTitle: t.jobTitle,
          companyName: t.companyName,
          quote: t.quote,
          consentStatus: t.consentStatus,
          status: t.status,
          sortOrder: t.sortOrder,
          avatarMediaId: t.avatarMediaId,
          avatarUrl: avatar?.publicUrl ?? null,
        }}
      />
    </div>
  );
}
