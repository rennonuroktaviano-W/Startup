import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { can } from "@/lib/permissions";
import { requiresAuth } from "@/lib/admin-guard";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit Log — Admin" };

const ACTION_LABEL: Record<string, string> = {
  login_success: "Login berhasil",
  login_failed: "Login gagal",
  logout: "Logout",
  create: "Membuat",
  update: "Mengubah",
  delete: "Menghapus",
  restore: "Memulihkan",
  publish: "Menerbitkan",
  preview: "Preview",
  role_change: "Ubah peran",
  settings_update: "Ubah pengaturan",
  lead_export: "Ekspor lead",
  attachment_download: "Unduh lampiran",
  backup: "Backup",
};

export default async function AuditLogsAdminPage() {
  const session = await requiresAuth();
  if (!can(session.user.role, "audit:read")) redirect("/admin/dashboard");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { actor: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Audit Log</h1>
      <p className="mt-1 text-sm text-ink/60">100 aktivitas terakhir. Hanya terbaca untuk Super Admin.</p>

      {logs.length === 0 ? (
        <p className="mt-8 rounded-xl border-2 border-dashed border-ink/20 p-6 text-center text-sm text-ink/60">Belum ada aktivitas tercatat.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {logs.map((log) => (
            <li key={log.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-ink/15 bg-surface p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  {ACTION_LABEL[log.action] ?? log.action}
                  {log.entityType && <span className="ml-2 text-xs font-normal text-ink/50">{log.entityType}</span>}
                </p>
                <p className="text-xs text-ink/55">
                  {log.actor?.name ?? "Sistem"} · {log.ipMasked ?? "—"}
                </p>
              </div>
              <span className="shrink-0 text-xs text-ink/50">{formatDateTime(log.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
