import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requiresAuth } from "@/lib/admin-guard";
import { TeamMemberForm } from "@/components/admin/cms/team-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Anggota Tim — Admin" };

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requiresAuth();
  const { id } = await params;
  const m = await prisma.teamMember.findUnique({ where: { id } });
  if (!m) notFound();
  const photo = m.photoMediaId ? await prisma.mediaAsset.findUnique({ where: { id: m.photoMediaId } }) : null;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit Anggota Tim</h1>
      <TeamMemberForm
        initial={{
          id: m.id,
          name: m.name,
          roleTitle: m.roleTitle,
          bio: m.bio,
          status: m.status,
          sortOrder: m.sortOrder,
          photoMediaId: m.photoMediaId,
          photoUrl: photo?.publicUrl ?? null,
          socialJson: m.socialJson,
        }}
      />
    </div>
  );
}
