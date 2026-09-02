import Link from "next/link";
import { cn } from "@/lib/utils";
import { processPhases } from "@/lib/content";
import { toneBg, type Tone } from "@/lib/tone";

export function ProcessRoad() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {processPhases.map((phase, i) => (
        <div key={phase.slug} className="relative">
          {i < processPhases.length - 1 && (
            <span
              aria-hidden
              className="absolute -right-3 top-1/2 z-10 hidden h-3 w-6 -translate-y-1/2 rotate-[-12deg] rounded-full border-2 border-ink bg-paper xl:block"
            />
          )}
          <div className="flex h-full flex-col rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)]">
            <span className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-bold", toneBg[phase.tone as Tone])}>
              {phase.number}
            </span>
            <h3 className="font-display text-xl font-semibold text-ink">{phase.name}</h3>
            <p className="mt-2 grow text-sm leading-relaxed text-ink/70">{phase.description}</p>
            <div className="mt-4 space-y-1.5 border-t-2 border-dashed border-ink/15 pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Output</p>
              {phase.outputs.map((o) => (
                <p key={o} className="text-sm text-ink/80">
                  {o}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Link
        href="/process"
        className="flex min-h-28 items-center justify-center rounded-2xl border-2 border-dashed border-ink/40 text-sm font-semibold text-ink/60 transition-colors hover:border-ink hover:text-purple"
      >
        Lihat alur lengkap →
      </Link>
    </div>
  );
}