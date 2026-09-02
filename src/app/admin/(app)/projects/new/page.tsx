import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/cms/project-form";

export const metadata = { title: "Tambah Proyek — Admin" };

export default async function NewProjectPage() {
  const [services, clients] = await Promise.all([
    prisma.service.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } }),
    prisma.client.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tambah Proyek Baru</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <ProjectForm services={services} clients={clients} />
      </div>
    </div>
  );
}