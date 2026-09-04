import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { getSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <AdminShell user={session.user}>
      {children}
      <Toaster position="top-center" closeButton richColors />
    </AdminShell>
  );
}