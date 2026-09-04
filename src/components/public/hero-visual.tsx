"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Sparkle, Star, Burst, BrowserCard, Squiggle } from "@/components/public/shapes";
import { cn } from "@/lib/utils";

export function HeroVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px]" aria-hidden>
      {/* Floating shape decorations */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.5, rotate: -30 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.9, 0.3, 1] }}
      >
        <Burst className="absolute left-[2%] top-[8%] h-8 w-8 rotate-6 text-lemon animate-float" />
      </motion.div>
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.5, rotate: 30 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.2, 0.9, 0.3, 1] }}
      >
        <Star className="absolute right-[6%] top-[4%] h-7 w-7 -rotate-6 text-coral animate-float [animation-delay:0.8s]" />
      </motion.div>
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.5 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
      >
        <Sparkle className="absolute bottom-[6%] left-[6%] h-6 w-6 text-sky animate-float [animation-delay:1.4s]" />
      </motion.div>

      {/* Orbiting satellite toys */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="animate-orbit absolute inset-[22%]"
      >
        <span className="absolute -left-3 -top-1.5 flex h-10 w-10 rotate-[-8deg] items-center justify-center rounded-xl border-2 border-ink bg-mint font-display text-[10px] font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]">
          404·
          <br />
          gone
        </span>
      </motion.div>
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="animate-orbit absolute inset-[10%] [animation-direction:reverse] [animation-duration:22s]"
      >
        <span className="absolute -right-2 bottom-2 h-8 w-14 -rotate-6 rounded-lg border-2 border-ink bg-sky px-1.5 py-1 text-[9px] font-bold leading-none text-ink shadow-[3px_3px_0_0_var(--ink)]">
          <span className="opacity-60">button</span>
          <br />
          ▲ cuba klik
        </span>
      </motion.div>

      {/* Main browser as toy website — with entrance */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 30, scale: 0.92 }}
        animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.9, 0.3, 1] }}
        className="absolute inset-[10%] animate-float [animation-delay:0.4s]"
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
                <motion.span
                  key={label}
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.1, ease: [0.2, 0.9, 0.3, 1] }}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg border-2 border-ink font-display text-[9px] font-bold",
                    i === 0 && "bg-lemon",
                    i === 1 && "bg-sky",
                    i === 2 && "bg-mint",
                  )}
                >
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
        </BrowserCard>

        {/* Code snippet floating element */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: 20 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="absolute -right-4 top-[15%] rotate-3"
        >
          <span className="flex h-7 items-center gap-1 rounded-lg border-2 border-ink bg-paper px-2 text-[8px] font-mono font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]">
            <span className="text-purple">&lt;</span>
            <span className="text-ink/70">div</span>
            <span className="text-purple">&gt;</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Floating cursor with trail */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.9, type: "spring", stiffness: 200, damping: 15 }}
        className="absolute right-[14%] top-[16%] rotate-6 text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 drop-shadow-[2px_2px_0_var(--ink)]" fill="currentColor">
          <path d="M4 3l7 17 2.5-6.5L20 11 4 3z" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Color swatches */}
      <motion.span
        initial={reduced ? undefined : { opacity: 0, x: -15 }}
        animate={reduced ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute left-[10%] top-[34%] flex gap-1 rounded-lg border-2 border-ink bg-surface p-1 shadow-[3px_3px_0_0_var(--ink)] animate-float [animation-delay:1s]"
      >
        <span className="h-3.5 w-3.5 rounded-sm bg-purple" />
        <span className="h-3.5 w-3.5 rounded-sm bg-lemon" />
        <span className="h-3.5 w-3.5 rounded-sm bg-coral" />
      </motion.span>

      {/* Wavy underline accent */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scaleX: 0 }}
        animate={reduced ? undefined : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 1.1, ease: [0.2, 0.9, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      >
        <Squiggle className="absolute -bottom-2 left-1/2 w-40 -translate-x-1/2 text-purple" />
      </motion.div>
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
      <Link href="#layanan" className="sr-only">
        Lanjut ke layanan
      </Link>
    </div>
  );
}