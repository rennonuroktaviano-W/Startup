"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const NAVIGATION_START_EVENT = "app:navigation:start";

const SHOW_DELAY = 140;
const SETTLE_DELAY = 340;
const MAX_VISIBLE = 10000;

/** Titik masuk bagi kode yang navigasi lewat router.push/router.replace. */
export function signalNavigationStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT));
  }
}

function isInternalHref(href: string | undefined, origin: string): boolean {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (/^(mailto:|tel:|sms:|javascript:|data:)/i.test(href)) return false;
  try {
    const url = new URL(href, origin);
    return url.origin === origin && url.pathname !== "";
  } catch {
    return false;
  }
}

export function NavigationIndicator() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  const activeRef = useRef(false);
  const timersRef = useRef<Record<string, number | null>>({});

  const clearAll = useCallback(() => {
    Object.values(timersRef.current).forEach((t) => {
      if (t) window.clearTimeout(t);
    });
    timersRef.current = {};
  }, []);

  const stop = useCallback(() => {
    clearAll();
    activeRef.current = false;
    setVisible(false);
  }, [clearAll]);

  const begin = useCallback(() => {
    clearAll();
    activeRef.current = true;
    timersRef.current.show = window.setTimeout(() => {
      setVisible(true);
      timersRef.current.max = window.setTimeout(stop, MAX_VISIBLE);
    }, SHOW_DELAY);
  }, [clearAll, stop]);

  // Navigasi benar-benar mendarat → beri jeda sebentar lalu sembunyikan.
  useEffect(() => {
    if (!activeRef.current) return;
    clearAll();
    timersRef.current.settle = window.setTimeout(() => {
      activeRef.current = false;
      setVisible(false);
    }, SETTLE_DELAY);
  }, [pathname, clearAll]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (activeRef.current) return;
      if (e.button !== 0) return;
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest?.("a[href]");
      if (!(el instanceof HTMLAnchorElement)) return;
      if (el.hasAttribute("download")) return;
      const target = el.getAttribute("target");
      if (target && target !== "_self") return;
      if (!isInternalHref(el.getAttribute("href") ?? undefined, window.location.origin)) return;
      begin();
    };

    const onNavStart = () => begin();

    document.addEventListener("click", onClick, true);
    window.addEventListener(NAVIGATION_START_EVENT, onNavStart);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAVIGATION_START_EVENT, onNavStart);
      clearAll();
    };
  }, [begin, clearAll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.2, 0.9, 0.3, 1] }}
          className="pointer-events-none fixed bottom-24 right-4 z-[80] flex items-center gap-2.5 rounded-full border-2 border-ink bg-surface/95 px-4 py-2.5 shadow-[3px_3px_0_0_var(--ink)] backdrop-blur md:bottom-6 lg:bottom-24"
        >
          <LoaderDots reduced={reducedMotion} />
          <span className="text-xs font-bold text-ink">Memuat…</span>
          <span className="sr-only">Memuat halaman</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoaderDots({ reduced }: { reduced: boolean | null }) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn("h-2 w-2 rounded-full border border-ink bg-purple")}
          animate={
            reduced ? { opacity: [0.5, 1, 0.5] } : { y: [0, -5, 0], opacity: [0.55, 1, 0.55] }
          }
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}