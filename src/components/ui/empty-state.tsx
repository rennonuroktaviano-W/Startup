import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "purple",
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "purple" | "lemon" | "sky" | "coral" | "mint";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/25 bg-surface/60 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink shadow-[3px_3px_0_0_var(--ink)]",
            {
              purple: "bg-purple text-white",
              lemon: "bg-lemon text-ink",
              sky: "bg-sky text-ink",
              coral: "bg-coral text-ink",
              mint: "bg-mint text-ink",
            }[tone],
          )}
        >
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {description && <p className="mx-auto mt-1 max-w-md text-sm text-ink/65">{description}</p>}
      </div>
      {action}
    </div>
  );
}