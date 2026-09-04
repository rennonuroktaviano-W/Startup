import { listNotifications } from "@/actions/notifications";
import { NotificationForm } from "@/components/admin/cms/notification-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Notifikasi — Admin" };

export default async function NotificationsAdminPage() {
  const notifications = await listNotifications();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 font-display text-2xl font-semibold text-ink">Notifikasi</h1>
      <p className="mb-6 text-sm text-ink/70">
        Kelola penerima notifikasi email untuk peristiwa penting, termasuk mini CRM dan publikasi konten.
      </p>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <NotificationForm initial={notifications} />
      </div>
    </div>
  );
}
