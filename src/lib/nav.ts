import type { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  number: string;
  tone: "purple" | "sky" | "coral" | "lemon" | "mint";
  mobileOnly?: boolean;
};

export const defaultNavItems: NavItem[] = [
  { label: "Home", href: "/", number: "01", tone: "purple" },
  { label: "Services", href: "/services", number: "02", tone: "sky" },
  { label: "Work", href: "/work", number: "03", tone: "coral" },
  { label: "About", href: "/about", number: "04", tone: "lemon" },
  { label: "Process", href: "/process", number: "05", tone: "mint" },
  { label: "Insight", href: "/insights", number: "06", tone: "purple" },
  { label: "Contact", href: "/contact", number: "07", tone: "coral" },
];

export const desktopMenuItems = defaultNavItems.slice(0, 7);
export const mobileDockItems = defaultNavItems.filter((i) =>
  ["/", "/services", "/work", "/contact"].includes(i.href),
);
export const mobileMoreItems = defaultNavItems.filter(
  (i) => !mobileDockItems.some((m) => m.href === i.href),
);

export const toneBg: Record<string, string> = {
  purple: "bg-purple text-white",
  sky: "bg-sky text-ink",
  coral: "bg-coral text-ink",
  lemon: "bg-lemon text-ink",
  mint: "bg-mint text-ink",
};

export type MenuAnchor = "menu" | "more";

export type { ReactNode };