import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requiresAuth } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tim — Admin" };

export default async function TeamAdminPage() {
  await requiresAuth();
  const items = await prisma.teamMember.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Tim</h1>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]"
        >
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">
          Belum ada anggota tim.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]">
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">{m.name}</p>
                <p className="truncate text-xs text-ink/60">{m.roleTitle} {m.status === "INACTIVE" && <span className="font-bold text-ink/40">· nonaktif</span>}</p>
              </div>
              <Link href={`/admin/team/${m.id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
