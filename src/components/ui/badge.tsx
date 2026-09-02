import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "ink" | "purple" | "lemon" | "coral" | "sky" | "mint" | "danger";

const tones: Record<Tone, string> = {
  ink: "bg-ink text-white",
  purple: "bg-purple text-white",
  lemon: "bg-lemon text-ink",
  coral: "bg-coral text-ink",
  sky: "bg-sky text-ink",
  mint: "bg-mint text-ink",
  danger: "bg-danger text-white",
};

export function Badge({
  tone = "ink",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border border-ink leading-none",
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}