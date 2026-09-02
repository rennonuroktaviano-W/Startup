import { cn } from "@/lib/utils";

export type ArtKind = "browser" | "dashboard" | "phone";

type Props = { kind: ArtKind; label: string; className?: string };

const accent: Record<ArtKind, string> = {
  browser: "bg-purple",
  dashboard: "bg-sky",
  phone: "bg-coral",
};

export function ArtFrame({ kind, label, className }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border-2 border-ink bg-surface shadow-[4px_4px_0_0_var(--ink)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rotate-12 opacity-20">
        <span className="block h-full w-full rounded-2xl bg-lemon" />
      </div>
      <div className="pointer-events-none absolute -bottom-5 -left-6 h-16 w-16 -rotate-12 rounded-full opacity-20">
        <span className={cn("block h-full w-full rounded-full", accent[kind])} />
      </div>

      {kind === "browser" && <ToyBrowser />}
      {kind === "dashboard" && <ToyDashboard />}
      {kind === "phone" && <ToyPhone />}
      <span className="sr-only">{label}</span>
    </div>
  );
}

function ToyBrowser() {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className="h-full w-full">
      <rect x="10" y="18" width="180" height="112" rx="6" fill="#FFF" stroke="#17132B" strokeWidth="3" />
      <path d="M10 18h180v14H10z" fill="#FFD84D" />
      <circle cx="22" cy="25" r="3" fill="#FF6B72" />
      <circle cx="32" cy="25" r="3" fill="#62D8FF" />
      <rect x="14" y="42" width="74" height="12" rx="6" fill="#7357FF" opacity="0.9" />
      <rect x="14" y="60" width="58" height="10" rx="5" fill="#17132B" opacity="0.25" />
      <rect x="14" y="76" width="64" height="10" rx="5" fill="#17132B" opacity="0.18" />
      <rect x="100" y="42" width="86" height="68" rx="6" fill="#66E2A6" opacity="0.28" />
      <rect x="108" y="52" width="70" height="26" rx="4" fill="#FFF9F3" stroke="#17132B" strokeWidth="2" />
      <rect x="108" y="84" width="70" height="18" rx="4" fill="#FFD84D" />
    </svg>
  );
}

function ToyDashboard() {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className="h-full w-full">
      <rect x="14" y="10" width="172" height="120" rx="8" fill="none" stroke="#17132B" strokeWidth="3" />
      <rect x="26" y="22" width="60" height="40" rx="6" fill="#FFF9F3" stroke="#17132B" strokeWidth="2.5" />
      <rect x="32" y="30" width="34" height="8" rx="4" fill="#62D8FF" />
      <rect x="32" y="44" width="44" height="10" rx="3" fill="#17132B" opacity="0.22" />
      <rect x="98" y="22" width="76" height="40" rx="6" fill="#FFF9F3" stroke="#17132B" strokeWidth="2.5" />
      <path d="M102 56l12-14 10 9 12-18 14 14 14-20" fill="none" stroke="#7357FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="26" y="72" width="148" height="40" rx="6" fill="#FFF9F3" stroke="#17132B" strokeWidth="2.5" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={48 + i * 16} cy={92} r="5" fill="#66E2A6" stroke="#17132B" strokeWidth="2" />
      ))}
      <rect x="104" y="84" width="60" height="9" rx="4.5" fill="#17132B" opacity="0.2" />
    </svg>
  );
}

function ToyPhone() {
  return (
    <svg viewBox="0 0 200 140" fill="none" aria-hidden className="h-full w-full">
      <rect x="70" y="12" width="60" height="116" rx="12" fill="#FFF9F3" stroke="#17132B" strokeWidth="3" />
      <rect x="78" y="20" width="44" height="32" rx="6" fill="#7357FF" />
      <rect x="82" y="26" width="28" height="6" rx="3" fill="#FFF9F3" opacity="0.9" />
      <rect x="82" y="36" width="34" height="5" rx="2.5" fill="#FFF9F3" opacity="0.7" />
      <rect x="78" y="58" width="44" height="12" rx="6" fill="#FFD84D" stroke="#17132B" strokeWidth="2" />
      <rect x="78" y="76" width="44" height="12" rx="6" fill="#66E2A6" stroke="#17132B" strokeWidth="2" />
      <rect x="78" y="94" width="44" height="26" rx="6" fill="none" stroke="#17132B" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}