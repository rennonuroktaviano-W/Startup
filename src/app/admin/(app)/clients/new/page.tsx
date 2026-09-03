import { requiresAuth } from "@/lib/admin-guard";
import { ClientForm } from "@/components/admin/cms/client-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tambah Klien — Admin" };

export default async function NewClientPage() {
  await requiresAuth();
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tambah Klien</h1>
      <ClientForm />
    </div>
  );
}
