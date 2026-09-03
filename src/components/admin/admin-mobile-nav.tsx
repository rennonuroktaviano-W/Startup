"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  Inbox,
  FileText,
  FolderKanban,
  Newspaper,
  HelpCircle,
  MessageSquareQuote,
  Users,
  Image as ImageIcon,
  Navigation,
  Settings,
  ScrollText,
  UserCog,
  LayoutTemplate,
  SearchCheck,
  Palette,
  Archive,
  type LucideIcon,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";

export type AdminMobileNavItem = {
  label: string;
  href: string;
  iconKey: string;
};

export type AdminMobileNavGroup = {
  section: string;
  items: AdminMobileNavItem[];
}[];

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  fileText: FileText,
  folderKanban: FolderKanban,
  newspaper: Newspaper,
  helpCircle: HelpCircle,
  quote: MessageSquareQuote,
  users: Users,
  image: ImageIcon,
  navigation: Navigation,
  settings: Settings,
  scrollText: ScrollText,
  userCog: UserCog,
  layout: LayoutTemplate,
  search: SearchCheck,
  palette: Palette,
  archive: Archive,
};

export function AdminMobileNav({
  navGroups,
  user,
  roleLabel,
}: {
  navGroups: AdminMobileNavGroup;
  user: SessionUser;
  roleLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-surface"
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Buka menu</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="relative flex h-full w-72 flex-col border-r-2 border-ink bg-paper shadow-xl">
            <div className="flex items-center justify-between border-b-2 border-ink/15 px-4 py-4">
              <p className="font-display text-sm font-bold">Menu Admin</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {navGroups.map((group) => (
                <div key={group.section} className="mb-5">
                  <p className="mb-2 px-2 text-xs font-bold uppercase tracking-widest text-ink/45">
                    {group.section}
                  </p>
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = ICONS[item.iconKey] ?? LayoutDashboard;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink/75"
                          >
                            <Icon className="h-4 w-4" /> {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="border-t-2 border-ink/15 p-4">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs font-semibold text-purple">{roleLabel}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}