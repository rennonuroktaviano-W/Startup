import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FaqForm } from "@/components/admin/cms/faq-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id }, select: { question: true } });
  return { title: faq ? `Edit FAQ — Admin` : "FAQ tidak ditemukan" };
}

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit FAQ</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <FaqForm
          initial={{
            id: faq.id,
            question: faq.question,
            answerJson: JSON.stringify(faq.answerJson, null, 2),
            category: faq.category,
            sortOrder: faq.sortOrder,
            status: faq.status,
          }}
        />
      </div>
    </div>
  );
}