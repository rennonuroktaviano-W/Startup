import Link from "next/link";
import { LayoutDashboard, LogOut, FileText, FolderKanban, Newspaper, HelpCircle, Users, Image as ImageIcon, Settings, Navigation, MessageSquareQuote } from "lucide-react";
import { siteConfig } from "@/lib/site";
import type { SessionUser } from "@/lib/auth/session";
import { logout } from "@/actions/auth";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { toySwitchFromRole } from "@/lib/admin-ui";

const navItems = [
  {
    section: "Utama",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Konten",
    items: [
      { label: "Layanan", href: "/admin/services", icon: FileText },
      { label: "Proyek", href: "/admin/projects", icon: FolderKanban },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
      { label: "FAQ", href: "/admin/faqs", icon: HelpCircle },
      { label: "Testimoni", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Klien", href: "/admin/clients", icon: Users },
      { label: "Tim", href: "/admin/team", icon: Users },
    ],
  },
  {
    section: "Website",
    items: [
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Navigasi", href: "/admin/navigation", icon: Navigation },
      { label: "Pengaturan", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const roleLabel = toySwitchFromRole(user.role);

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-grain pointer-events-none fixed inset-0" />
      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r-2 border-ink bg-surface/90 backdrop-blur lg:flex">
          <Link href="/" className="flex items-center gap-2 border-b-2 border-ink/15 px-5 py-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-xs font-bold">
              KI
            </span>
            <div>
              <p className="font-display text-sm font-bold leading-tight">{siteConfig.name}</p>
              <p className="text-xs text-ink/60">Admin Panel</p>
            </div>
          </Link>
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Navigasi admin">
            {navItems.map((group) => (
              <div key={group.section}>
                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-ink/45">
                  {group.section}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SidebarLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="border-t-2 border-ink/15 p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-sky">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                <p className="text-xs font-semibold text-purple">{roleLabel}</p>
              </div>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-2 text-sm font-semibold hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile: topbar + drawer */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b-2 border-ink bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
            <AdminMobileNav navGroups={navItems} user={user} roleLabel={roleLabel} />
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-xs font-bold">
                KI
              </span>
              <span className="font-display text-sm font-bold">{siteConfig.name}</span>
            </Link>
            <form action={logout}>
              <button type="submit" aria-label="Keluar" className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-surface">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </header>
          <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ item }: { item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> } }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
    >
      <Icon className="h-4 w-4" /> {item.label}
    </Link>
  );
}

export type AdminNavGroup = typeof navItems;