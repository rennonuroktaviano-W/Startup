import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { can } from "@/lib/permissions";
import { requiresAuth } from "@/lib/admin-guard";
import { UsersManager } from "@/components/admin/cms/users-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users — Admin" };

export default async function UsersAdminPage() {
  const session = await requiresAuth();
  if (!can(session.user.role, "users:manage")) redirect("/admin/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Users & Peran</h1>
      <p className="mt-1 text-sm text-ink/60">Kelola akun admin dan hak akses.</p>
      <div className="mt-5">
        <UsersManager
          users={users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
