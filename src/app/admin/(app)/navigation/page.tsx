import { getNavigation } from "@/actions/navigation";
import { NavEditor } from "@/components/admin/cms/nav-editor";

export const dynamic = "force-dynamic";

export const metadata = { title: "Navigasi — Admin" };

export default async function NavigationAdminPage() {
  const items = await getNavigation();
  const mapped = items.map((it) => ({
    id: it.id,
    label: it.label,
    href: it.href,
    type: it.type,
    isCta: it.isCta,
    isVisible: it.isVisible,
    desktopOrder: it.desktopOrder,
  }));
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Navigasi Website</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <NavEditor initial={mapped} />
      </div>
    </div>
  );
}