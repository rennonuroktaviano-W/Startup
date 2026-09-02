import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { TogglePublish } from "@/components/admin/cms/toggle-publish";

export const dynamic = "force-dynamic";

export const metadata = { title: "Layanan — Admin" };

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" }, where: { deletedAt: null } });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Layanan</h1>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]"
        >
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">
          Belum ada layanan. Klik &quot;Tambah&quot; untuk membuat baru.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{svc.name}</p>
                <p className="truncate text-xs text-ink/60">{svc.shortDescription?.slice(0, 80) ?? "—"}</p>
                <p className="mt-1 text-xs text-ink/50">{formatDateTime(svc.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <TogglePublish
                  id={svc.id}
                  status={svc.status}
                  entityType="Service"
                />
                <Link
                  href={`/admin/services/${svc.id}/edit`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon"
                  aria-label="Edit"
                >
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