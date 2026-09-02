import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectForm } from "@/components/admin/cms/project-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { title: true } });
  return { title: project ? `Edit ${project.title} — Admin` : "Proyek tidak ditemukan" };
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { projectServices: true } });
  if (!project) notFound();

  const [services, clients] = await Promise.all([
    prisma.service.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } }),
    prisma.client.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit: {project.title}</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <ProjectForm
          services={services}
          clients={clients}
          initial={{
            id: project.id,
            title: project.title,
            projectType: project.projectType,
            industry: project.industry ?? "",
            year: project.year ? String(project.year) : "",
            summary: project.summary ?? "",
            challengeJson: JSON.stringify(project.challengeJson ?? [], null, 2),
            goalsJson: JSON.stringify(project.goalsJson ?? [], null, 2),
            approachJson: JSON.stringify(project.approachJson ?? [], null, 2),
            outcomeJson: JSON.stringify(project.outcomeJson ?? [], null, 2),
            isFeatured: project.isFeatured,
            status: project.status,
            serviceIds: project.projectServices.map((ps) => ps.serviceId),
            clientId: project.clientId ?? "",
          }}
        />
      </div>
    </div>
  );
}