import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Halaman — Admin" };

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { sections: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Halaman</h1>
          <p className="text-sm text-ink/60">Kelola halaman generik dan komposisi tekstur kontennya.</p>
        </div>
        <Link href="/admin/pages/new" className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]">
          <Plus className="h-4 w-4" /> Halaman baru
        </Link>
      </div>
      {pages.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">Belum ada halaman. Buat halaman pertama Anda.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{page.title}</p>
                <p className="truncate text-xs text-ink/60">
                  /{page.slug} · {page.pageType} · {page.status} · {page._count.sections} bagian
                </p>
                <p className="mt-1 text-xs text-ink/50">{formatDate(page.updatedAt)}</p>
              </div>
              <Link href={`/admin/pages/${page.id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}