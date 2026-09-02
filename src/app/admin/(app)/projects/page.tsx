import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { TogglePublish } from "@/components/admin/cms/toggle-publish";

export const dynamic = "force-dynamic";

export const metadata = { title: "Proyek — Admin" };

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, where: { deletedAt: null } });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Proyek</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)]"
        >
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">
          Belum ada proyek.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{proj.title}</p>
                <p className="truncate text-xs text-ink/60">{proj.summary?.slice(0, 80) ?? "—"}</p>
                <p className="mt-1 text-xs text-ink/50">{proj.year ?? "—"} · {formatDate(proj.updatedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <TogglePublish id={proj.id} status={proj.status} entityType="Project" />
                <Link href={`/admin/projects/${proj.id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon" aria-label="Edit">
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