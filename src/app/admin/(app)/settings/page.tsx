import { getSettings } from "@/actions/settings";
import { SettingsForm } from "@/components/admin/cms/settings-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pengaturan — Admin" };

export default async function SettingsAdminPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Pengaturan Website</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}