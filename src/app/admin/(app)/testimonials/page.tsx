import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requiresAuth } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Testimoni — Admin" };

export default async function TestimonialsAdminPage() {
  await requiresAuth();
  const items = await prisma.testimonial.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Testimoni</h1>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]"
        >
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">
          Belum ada testimoni. Hanya testimoni published yang tampil di publik.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">
                  {t.personName}
                  {t.status === "PUBLISHED" && (
                    <span className="ml-2 rounded-full border-2 border-ink bg-mint px-1.5 py-0.5 text-[10px] font-bold">Published</span>
                  )}
                </p>
                <p className="truncate text-xs text-ink/60">{(t.companyName ?? t.jobTitle) ?? "—"} · {t.quote.slice(0, 60)}…</p>
              </div>
              <Link href={`/admin/testimonials/${t.id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
