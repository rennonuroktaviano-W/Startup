"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  FolderKanban,
  Newspaper,
  FolderTree,
  Tag,
  HelpCircle,
  MessageSquareQuote,
  Users,
  Image as ImageIcon,
  LayoutTemplate,
  SearchCheck,
  Palette,
  Archive,
  Navigation,
  Settings,
  ScrollText,
  UserCog,
  Bell,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  fileText: FileText,
  folderKanban: FolderKanban,
  newspaper: Newspaper,
  folderTree: FolderTree,
  tag: Tag,
  helpCircle: HelpCircle,
  quote: MessageSquareQuote,
  users: Users,
  image: ImageIcon,
  layout: LayoutTemplate,
  search: SearchCheck,
  palette: Palette,
  archive: Archive,
  navigation: Navigation,
  settings: Settings,
  scrollText: ScrollText,
  userCog: UserCog,
  bell: Bell,
};

export function SidebarLink({ label, href, iconKey }: { label: string; href: string; iconKey: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  const Icon = ICONS[iconKey] ?? LayoutDashboard;

  return (
    <li className="relative">
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          transition={{ type: "spring", stiffness: 480, damping: 44 }}
          className="absolute inset-0 rounded-xl border-2 border-purple bg-purple/15"
        />
      )}
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink/70 transition-all duration-200 hover:bg-ink/5 hover:text-ink"
      >
        <Icon className="h-4 w-4" />
        <span className={active ? "text-ink" : ""}>{label}</span>
      </Link>
    </li>
  );
}