"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkle, Star, Burst, BrowserCard, Squiggle } from "@/components/public/shapes";
import { cn } from "@/lib/utils";

const ORBIT_STYLES = [
  { inset: "22%", dir: "", dur: "18s" },
  { inset: "10%", dir: "reverse", dur: "24s" },
] as const;

const SPIN_SPEED = 0.35;
const LERP = 0.14;

function subscribeToMedia(query: string, onStoreChange: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getMatch(query: string, fallback: boolean) {
  return typeof window !== "undefined" && window.matchMedia(query).matches ? true : fallback;
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => subscribeToMedia(query, cb),
    () => getMatch(query, false),
    () => false,
  );
}

function useLowCapability() {
  const [low] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduceData = window.matchMedia("(prefers-reduced-data: reduce)")?.matches ?? false;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    return reduceData || (nav.connection?.saveData ?? false) || ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
  });
  return low;
}

export function Hero3D() {
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const lowCap = useLowCapability();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const interactive = fine && !lowCap && !reduced;
  const showDrag = interactive;

  // Rotasi sumbu-Y (derajat). `target` digerakkan oleh drag/auto-spin,
  // `current` di-lerp menuju `target` untuk transisi halus.
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const draggingRef = useRef(false);
  const pointerActiveRef = useRef(false);
  const lastXRef = useRef<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!interactive) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;

    const tick = () => {
      // Auto-spin lembut saat pointer tidak di atas & tidak sedang di-drag.
      if (!pointerActiveRef.current && !draggingRef.current) {
        targetRef.current += SPIN_SPEED;
      }
      currentRef.current += (targetRef.current - currentRef.current) * LERP;
      const node = cardRef.current;
      if (node) {
        node.style.transform = `rotateY(${currentRef.current}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [interactive]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;
      draggingRef.current = true;
      pointerActiveRef.current = true;
      lastXRef.current = e.clientX;
      e.currentTarget.setPointerCapture(e.pointerId);
      // Smooth ease ke posisi saat menarik; berhenti dari auto-spin pada posisi ini.
    },
    [interactive],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive || !draggingRef.current || lastXRef.current === null) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      targetRef.current += dx * 0.6;
    },
    [interactive],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;
      draggingRef.current = false;
      pointerActiveRef.current = false;
      lastXRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [interactive],
  );

  const onPointerEnter = useCallback(() => {
    if (!interactive) return;
    pointerActiveRef.current = true;
  }, [interactive]);

  const onPointerLeave = useCallback(() => {
    if (!interactive) return;
    pointerActiveRef.current = false;
    draggingRef.current = false;
    lastXRef.current = null;
  }, [interactive]);

  const onClickHint = useCallback(() => {
    if (!interactive) return;
    setLabel("Puter: seret ke kiri / kanan");
    window.setTimeout(() => setLabel(null), 2200);
  }, [interactive]);

  return (
    <div
      ref={stageRef}
      className="relative mx-auto aspect-[4/3] w-full max-w-[560px] [perspective:1600px]"
      aria-hidden
    >
      {/* Rotatable 3D stage */}
      <div
        ref={cardRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClickHint}
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          showDrag && "cursor-grab touch-none active:cursor-grabbing",
          reduced && "transform-none",
        )}
        style={{ willChange: "transform" }}
      >
        {/* Floating decorations */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.5, rotate: -30 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-[2%] top-[8%] [transform:translateZ(60px)]"
        >
          <Burst className="h-8 w-8 rotate-6 text-lemon animate-float" />
        </motion.div>
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.5, rotate: 30 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="absolute right-[6%] top-[4%] [transform:translateZ(40px)]"
        >
          <Star className="h-7 w-7 -rotate-6 text-coral animate-float [animation-delay:0.8s]" />
        </motion.div>
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.5 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-[6%] left-[6%] [transform:translateZ(30px)]"
        >
          <Sparkle className="h-6 w-6 text-sky animate-float [animation-delay:1.4s]" />
        </motion.div>

        {/* Orbiting satellite toys */}
        {ORBIT_STYLES.map((o, i) => (
          <motion.div
            key={i}
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
            className={cn("absolute [transform:translateZ(50px)] animate-orbit", o.dir && "[animation-direction:reverse]")}
            style={{ inset: o.inset, animationDuration: o.dur }}
          >
            {i === 0 ? (
              <span className="absolute -left-3 -top-1.5 flex h-10 w-10 rotate-[-8deg] items-center justify-center rounded-xl border-2 border-ink bg-mint font-display text-[10px] font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]">
                404·
                <br />
                gone
              </span>
            ) : (
              <span className="absolute -right-2 bottom-2 h-8 w-14 -rotate-6 rounded-lg border-2 border-ink bg-sky px-1.5 py-1 text-[9px] font-bold leading-none text-ink shadow-[3px_3px_0_0_var(--ink)]">
                <span className="opacity-60">button</span>
                <br />
                ▲ cuba klik
              </span>
            )}
          </motion.div>
        ))}

        {/* Main browser as toy website */}
        <div
          className="absolute inset-[10%] animate-float [animation-delay:0.4s]"
          style={{ transform: "translateZ(20px)" }}
        >
          <BrowserCard className="relative h-full w-full">
            <div className="relative h-[72%] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="h-3 w-16 rounded-full bg-ink/25 sm:w-20" />
                <div className="flex gap-1.5">
                  <span className="h-3 w-8 rounded-full bg-ink/10" />
                  <span className="h-3 w-8 rounded-full bg-ink/10" />
                  <span className="flex h-6 items-center rounded-full bg-purple px-2 text-[8px] font-bold text-white animate-pulse-soft">CTA ▶</span>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <span className="block h-2.5 w-3/4 rounded-full bg-ink/25" />
                <span className="block h-2.5 w-1/2 rounded-full bg-ink/10" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                {(["sketch", "build", "ship"] as const).map((label, i) => (
                  <span
                    key={label}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-lg border-2 border-ink font-display text-[9px] font-bold",
                      i === 0 && "bg-lemon",
                      i === 1 && "bg-sky",
                      i === 2 && "bg-mint",
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </BrowserCard>

          {/* Code snippet floating element */}
          <div className="absolute -right-4 top-[15%] rotate-3 [transform:translateZ(50px)]">
            <span className="flex h-7 items-center gap-1 rounded-lg border-2 border-ink bg-paper px-2 text-[8px] font-mono font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]">
              <span className="text-purple">&lt;</span>
              <span className="text-ink/70">div</span>
              <span className="text-purple">&gt;</span>
            </span>
          </div>
        </div>

        {/* Floating cursor (draggable sprite) */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.9, type: "spring", stiffness: 200, damping: 15 }}
          className="absolute right-[14%] top-[14%] rotate-6 [transform:translateZ(80px)] text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 drop-shadow-[2px_2px_0_var(--ink)]" fill="currentColor">
            <path d="M4 3l7 17 2.5-6.5L20 11 4 3z" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* Color swatches */}
        <span className="absolute left-[10%] top-[34%] flex gap-1 rounded-lg border-2 border-ink bg-surface p-1 shadow-[3px_3px_0_0_var(--ink)] animate-float [animation-delay:1s] [transform:translateZ(40px)]">
          <span className="h-3.5 w-3.5 rounded-sm bg-purple" />
          <span className="h-3.5 w-3.5 rounded-sm bg-lemon" />
          <span className="h-3.5 w-3.5 rounded-sm bg-coral" />
        </span>

        {/* Wavy underline accent */}
        <div style={{ transform: "translateZ(70px)", transformOrigin: "center" }}>
          <Squiggle className="absolute -bottom-2 left-1/2 w-40 -translate-x-1/2 text-purple" />
        </div>

        {/* Drag hint */}
        <div
          className={cn(
            "pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-surface px-3 py-1 text-[10px] font-bold text-ink/60 transition-opacity duration-500",
            interactive && label ? "opacity-100" : "opacity-0",
          )}
        >
          {label ?? "Seret untuk memutar 360°"}
        </div>
      </div>
    </div>
  );
}

export function ScrollHint() {
  return (
    <div className="mt-12 flex flex-col items-center gap-1 text-ink/50">
      <span className="text-xs font-semibold uppercase tracking-widest">Scroll untuk menjelajah</span>
      <span className="animate-float h-8 w-5 rounded-full border-2 border-ink/40">
        <span className="mx-auto mt-1 block h-2 w-1 rounded-full bg-ink/50" />
      </span>
      <span className="sr-only">Lanjut ke layanan</span>
    </div>
  );
}
