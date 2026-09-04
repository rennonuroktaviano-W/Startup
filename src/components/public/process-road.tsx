"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { processPhases } from "@/lib/content";
import { toneBg, type Tone } from "@/lib/tone";

export function ProcessRoad() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 60%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const toyLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={sectionRef} className="relative">
      {/* Scroll-driven toy path track */}
      <div
        aria-hidden
        className="relative mb-8 hidden h-2.5 rounded-full border-2 border-ink bg-paper xl:block"
      >
        <motion.div
          style={{ width: progress }}
          className="absolute inset-y-0 left-0 rounded-full bg-purple/40"
        />
        <motion.div
          style={{ left: toyLeft }}
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-lemon shadow-[2px_2px_0_0_var(--ink)]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {processPhases.map((phase, i) => (
          <PhaseCard key={phase.slug} phase={phase} index={i} reduced={!!prefersReduced} />
        ))}
      </div>
      <Link
        href="/process"
        className="mt-6 flex min-h-20 items-center justify-center rounded-2xl border-2 border-dashed border-ink/40 text-sm font-semibold text-ink/60 transition-colors hover:border-ink hover:text-purple"
      >
        Lihat alur lengkap →
      </Link>
    </div>
  );
}

function PhaseCard({
  phase,
  index,
  reduced,
}: {
  phase: (typeof processPhases)[number];
  index: number;
  reduced: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {index < processPhases.length - 1 && (
        <span
          aria-hidden
          className="absolute -right-3 top-1/2 z-10 hidden h-3 w-6 -translate-y-1/2 rotate-[-12deg] rounded-full border-2 border-ink bg-paper xl:block"
        />
      )}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        className="flex h-full flex-col rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <motion.span
            initial={reduced ? false : { rotate: 0 }}
            whileInView={reduced ? undefined : { rotate: -4 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn("flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-bold", toneBg[phase.tone as Tone])}
          >
            {phase.number}
          </motion.span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={`${open ? "Tutup" : "Lihat"} detail fase ${phase.name}`}
            className="rounded-full border-2 border-ink bg-paper px-2.5 py-1 text-xs font-bold text-ink/70 transition-colors hover:bg-ink/5"
          >
            {open ? "Tutup" : "Detail"}
          </button>
        </div>
        <h3 className="font-display text-xl font-semibold text-ink">{phase.name}</h3>
        <p className="mt-2 grow text-sm leading-relaxed text-ink/70">{phase.description}</p>
        {open && (
          <div className="mt-3 space-y-3 border-t-2 border-dashed border-ink/15 pt-3 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Aktivitas</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-ink/75">
                {phase.activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Output</p>
              {phase.outputs.map((o) => (
                <p key={o} className="text-ink/80">
                  {o}
                </p>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
