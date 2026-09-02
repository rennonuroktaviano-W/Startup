import Link from "next/link";
import { Sparkle, Star, Burst, BrowserCard, Squiggle } from "@/components/public/shapes";
import { cn } from "@/lib/utils";

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px]" aria-hidden>
      <Burst className="absolute left-[2%] top-[8%] h-8 w-8 rotate-6 text-lemon animate-float" />
      <Star className="absolute right-[6%] top-[4%] h-7 w-7 -rotate-6 text-coral animate-float [animation-delay:0.8s]" />
      <Sparkle className="absolute bottom-[6%] left-[6%] h-6 w-6 text-sky animate-float [animation-delay:1.4s]" />

      {/* Orbiting satellite toys */}
      <div className="animate-orbit absolute inset-[22%]">
        <span className="absolute -left-3 -top-1.5 flex h-10 w-10 rotate-[-8deg] items-center justify-center rounded-xl border-2 border-ink bg-mint font-display text-[10px] font-bold text-ink shadow-[3px_3px_0_0_var(--ink)]">
          404·
          <br />
          gone
        </span>
      </div>
      <div className="animate-orbit absolute inset-[10%] [animation-direction:reverse] [animation-duration:22s]">
        <span className="absolute -right-2 bottom-2 h-8 w-14 -rotate-6 rounded-lg border-2 border-ink bg-sky px-1.5 py-1 text-[9px] font-bold leading-none text-ink shadow-[3px_3px_0_0_var(--ink)]">
          <span className="opacity-60">button</span>
          <br />
          ▲ cuba klik
        </span>
      </div>

      {/* Main browser as toy website */}
      <div className="absolute inset-[10%] animate-float [animation-delay:0.4s]">
        <BrowserCard className="relative h-full w-full">
          <div className="relative h-[72%] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="h-3 w-16 rounded-full bg-ink/25 sm:w-20" />
              <div className="flex gap-1.5">
                <span className="h-3 w-8 rounded-full bg-ink/10" />
                <span className="h-3 w-8 rounded-full bg-ink/10" />
                <span className="flex h-6 items-center rounded-full bg-purple px-2 text-[8px] font-bold text-white">CTA ▶</span>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <span className="block h-2.5 w-3/4 rounded-full bg-ink/25" />
              <span className="block h-2.5 w-1/2 rounded-full bg-ink/10" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
              {["sketch", "build", "ship"].map((label, i) => (
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
      </div>

      {/* Floating cursor */}
      <span className="absolute right-[14%] top-[16%] rotate-6 text-ink">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M4 3l7 17 2.5-6.5L20 11 4 3z" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Color swatches */}
      <span className="absolute left-[10%] top-[34%] flex gap-1 rounded-lg border-2 border-ink bg-surface p-1 shadow-[3px_3px_0_0_var(--ink)] animate-float [animation-delay:1s]">
        <span className="h-3.5 w-3.5 rounded-sm bg-purple" />
        <span className="h-3.5 w-3.5 rounded-sm bg-lemon" />
        <span className="h-3.5 w-3.5 rounded-sm bg-coral" />
      </span>

      {/* Wavy underline accent */}
      <Squiggle className="absolute -bottom-2 left-1/2 w-40 -translate-x-1/2 text-purple" />
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