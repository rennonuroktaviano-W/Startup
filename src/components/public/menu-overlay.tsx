"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { desktopMenuItems, toneBg } from "@/lib/nav";
import { useAnalytics } from "@/components/analytics/analytics-provider";
import { Sparkle } from "@/components/public/shapes";

export function MenuOverlay({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();

  useEffect(() => {
    const trigger = document.querySelector<HTMLButtonElement>("[data-menu-orb]");
    document.body.style.overflow = "hidden";
    const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();
    return () => {
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !overlayRef.current) return;
    const focusables = Array.from(
      overlayRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-40 animate-[overlay-in_0.25s_ease-out]">
      <div className="absolute inset-0 bg-paper/95 backdrop-blur-md" />
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu utama"
        onKeyDown={onKeyDown}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
      >
        <p className="toy-sticker mb-8 rotate-[-2deg] bg-lemon">Main dulu, yuk.</p>
        <nav aria-label="Menu utama" className="w-full max-w-md space-y-2">
          {desktopMenuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  track("nav_item_click", { href: item.href, label: item.label });
                  onClose();
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border-2 border-ink bg-surface px-5 py-3 shadow-[3px_3px_0_0_var(--ink)] transition-all",
                  "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[0_0_0_0_var(--ink)]",
                  active && "ring-[3px] ring-purple",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/30 font-display text-sm font-bold",
                    toneBg[item.tone],
                  )}
                >
                  {item.number}
                </span>
                <span className="font-display text-xl font-semibold text-ink">{item.label}</span>
                <Sparkle className="ml-auto h-4 w-4 text-ink/25 transition-all group-hover:scale-125 group-hover:text-purple" />
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-full border-2 border-ink bg-ink px-6 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_var(--purple)] hover:translate-y-[2px]"
        >
          Tutup (Esc)
        </button>
      </div>
    </div>
  );
}