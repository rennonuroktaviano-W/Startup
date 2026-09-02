import { cn } from "@/lib/utils";

type Props = { className?: string };

export function Squiggle({ className }: Props) {
  return (
    <svg viewBox="0 0 120 24" fill="none" aria-hidden className={cn("pointer-events-none", className)}>
      <path
        d="M3 12c10-14 20 14 30 0s20-14 30 0 20 14 30 0 20-14 27-1"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Sparkle({ className }: Props) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" aria-hidden className={cn("pointer-events-none", className)}>
      <path d="M20 2c2 9 4 15 8 19 4 4 10 6 10 8-8 1-13 3-17 8-3-5-8-7-16-8 0-3 6-4 10-8 4-4 4-11 5-19z" />
    </svg>
  );
}

export function Star({ className }: Props) {
  return (
    <svg viewBox="0 0 44 44" fill="currentColor" aria-hidden className={cn("pointer-events-none", className)}>
      <path d="M22 2l5.4 14.6L42 22l-14.6 5.4L22 42l-5.4-14.6L2 22l14.6-5.4z" />
    </svg>
  );
}

export function Burst({ className }: Props) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden className={cn("pointer-events-none", className)}>
      <path d="M24 1l3.2 14.3h13L33 22.4l3.8 13.6L24 27.8 11.2 36l3.8-13.6-7.2-7.1h13z" />
    </svg>
  );
}

export function BrowserCard({ className, children }: Props & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-ink bg-surface shadow-[4px_4px_0_0_var(--ink)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b-2 border-ink/20 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-coral" />
        <span className="h-2.5 w-2.5 rounded-full bg-lemon" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint" />
      </div>
      {children}
    </div>
  );
}