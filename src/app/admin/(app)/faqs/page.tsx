import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "FAQ — Admin" };

export default async function FaqAdminPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">FAQ</h1>
        <Link href="/admin/faqs/new" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]">
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>
      {faqs.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">Belum ada FAQ.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{faq.question}</p>
                <p className="truncate text-xs text-ink/60">{faq.category} · {faq.status}</p>
                <p className="mt-1 text-xs text-ink/50">{formatDate(faq.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/faqs/${faq.id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}