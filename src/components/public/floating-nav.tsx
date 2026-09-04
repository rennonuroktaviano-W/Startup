"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { useAnalytics } from "@/components/analytics/analytics-provider";
import { MenuOverlay } from "@/components/public/menu-overlay";
import { MobileDock } from "@/components/public/mobile-dock";

export function FloatingNav({ brandName = siteConfig.name }: { brandName?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctaHidden, setCtaHidden] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const { track } = useAnalytics();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const bottom = doc.scrollHeight - window.innerHeight - doc.scrollTop;
      setCtaHidden(bottom < 320 || menuOpen);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const frame = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  const isContact = pathname === "/contact";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return window.removeEventListener("keydown", onKey);
  }, [isAdmin]);

  if (isAdmin) return null;

  return (
    <>
      {/* Brand pebble */}
      <Link
        href="/"
        aria-label={`${brandName} — kembali ke Home`}
        className="toy-surface fixed left-3 top-3 z-40 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 md:left-5 md:top-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-sm font-bold shadow-[2px_2px_0_0_var(--ink)]">
          KI
        </span>
        <span className="font-display text-sm font-semibold text-ink sm:text-base">
          {brandName}
        </span>
      </Link>

      {/* Menu orb */}
      <button
        type="button"
        data-menu-orb
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
        onClick={() => {
          setMenuOpen((v) => {
            if (!v) track("nav_open");
            return !v;
          });
        }}
        className={cn(
          "toy-surface fixed right-3 top-3 z-40 flex h-12 w-12 items-center justify-center rounded-full transition-transform md:right-5 md:top-5",
          menuOpen ? "rotate-90" : "hover:rotate-6",
          reducedMotion && "hover:rotate-0",
        )}
      >
        <MenuGlyph open={menuOpen} />
      </button>

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}

      {/* Project CTA bubble (desktop) */}
      {!menuOpen && !ctaHidden && (
        <Link
          href="/contact"
          onClick={() => track("primary_cta_click", { label: "floating_bubble" })}
          className="toy-surface group fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full py-2.5 pl-3 pr-5 transition-all hover:-translate-y-1 lg:flex"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-purple text-white transition-transform group-hover:rotate-[-8deg]">
            <PenLine className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold text-ink">Mulai proyek</span>
        </Link>
      )}

      {/* Mobile dock */}
      <MobileDock compact={isContact} />
    </>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]" aria-hidden>
      <span className={cn("h-[2.5px] w-5 rounded-full bg-ink transition-all", open && "w-3 rotate-45 translate-y-[3px]")} />
      <span className={cn("h-[2.5px] w-5 rounded-full bg-ink transition-all", open && "opacity-0")} />
      <span className={cn("h-[2.5px] w-5 rounded-full bg-ink transition-all", open && "w-3 -rotate-45 -translate-y-[3px]")} />
    </span>
  );
}