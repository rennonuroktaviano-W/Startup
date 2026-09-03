import { requiresAuth } from "@/lib/admin-guard";
import { TeamMemberForm } from "@/components/admin/cms/team-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Anggota Tim — Admin" };

export default async function NewTeamMemberPage() {
  await requiresAuth();
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tambah Anggota Tim</h1>
      <TeamMemberForm />
    </div>
  );
}
