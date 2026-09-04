"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppWindow, Briefcase, Home as HomeIcon, LayoutGrid, MessageCircle, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mobileDockItems, mobileMoreItems, toneBg } from "@/lib/nav";
import { useAnalytics } from "@/components/analytics/analytics-provider";

const icons: Record<string, React.ReactNode> = {
  "/": <HomeIcon className="h-5 w-5" />,
  "/services": <LayoutGrid className="h-5 w-5" />,
  "/work": <Briefcase className="h-5 w-5" />,
  "/contact": <MessageCircle className="h-5 w-5" />,
};

export function MobileDock({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();

  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
      sheetRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return window.removeEventListener("keydown", onKey);
  }, []);

  if (compact) {
    return (
      <nav
        aria-label="Navigasi singkat"
        className="fixed inset-x-3 bottom-3 z-40 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="toy-surface flex items-center justify-between rounded-2xl px-4 py-2.5">
          <Link
            href="/"
            aria-label="Kembali ke Home"
            className="flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-surface px-3 text-sm font-bold shadow-[2px_2px_0_0_var(--ink)]"
          >
            <HomeIcon className="h-4 w-4" /> Home
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex h-11 items-center rounded-full border-2 border-ink bg-lemon px-4 text-sm font-bold shadow-[2px_2px_0_0_var(--ink)]"
          >
            Kembali ke atas
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-3 bottom-3 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="toy-surface flex items-stretch justify-between gap-1 rounded-3xl px-2 py-2">
        {mobileDockItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => track("nav_item_click", { href: item.href, label: item.label })}
              className={cn(
                "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-bold transition-colors",
                active ? cn(toneBg[item.tone], "shadow-[2px_2px_0_0_var(--ink)]") : "text-ink/65 hover:bg-ink/5",
              )}
            >
              {icons[item.href]}
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          className="flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-bold text-ink/65 hover:bg-ink/5"
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>Lainnya</span>
        </button>
      </div>

      {sheetOpen && (
        <div data-sheet className="fixed inset-0 z-50 flex items-end">
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu lainnya"
            tabIndex={-1}
            className="relative w-full rounded-t-3xl border-2 border-b-0 border-ink bg-paper p-5 shadow-[0_-6px_0_0_var(--ink)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/20" />
            <div className="mb-4 flex items-center justify-between">
              <AppWindow className="h-5 w-5 text-purple" />
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Tutup menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {mobileMoreItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      track("nav_item_click", { href: item.href, label: item.label });
                      setSheetOpen(false);
                    }}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl border-2 border-ink bg-surface px-4 py-3 font-display text-lg font-semibold shadow-[2px_2px_0_0_var(--ink)]",
                      active && "ring-[3px] ring-purple",
                    )}
                  >
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold", toneBg[item.tone])}>
                      {item.number}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}