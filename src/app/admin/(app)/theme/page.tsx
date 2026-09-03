import { getSettings } from "@/actions/settings";
import { ThemeForm } from "@/components/admin/cms/theme-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tema & Gerakan — Admin" };

export default async function ThemeAdminPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 font-display text-2xl font-semibold text-ink">Tema & Gerakan</h1>
      <p className="mb-6 text-sm text-ink/60">Sesuaikan warna merek, intensitas gerakan, dan dekorasi. Perubahan diterapkan langsung ke seluruh situs.</p>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <ThemeForm initial={settings} />
      </div>
    </div>
  );
}