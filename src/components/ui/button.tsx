import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "lemon";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full border-2 border-ink transition-all duration-200 select-none disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-purple active:translate-y-[2px] active:scale-[0.97] active:shadow-none motion-safe:transition-[transform,box-shadow]";

const variants: Record<Variant, string> = {
  primary:
    "bg-purple text-white border-ink shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--ink)]",
  secondary:
    "bg-surface text-ink border-ink shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px]",
  outline:
    "bg-transparent text-ink border-ink hover:bg-surface/70",
  ghost: "bg-transparent text-ink border-transparent hover:bg-ink/5",
  danger:
    "bg-danger text-white border-ink shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px]",
  lemon: "bg-lemon text-ink border-ink shadow-[3px_3px_0_0_var(--ink)] hover:translate-x-[1px] hover:translate-y-[1px]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-8 text-base md:text-lg",
};

export type ToyButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
  form?: string;
  onClick?: (e: MouseEvent) => void;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean;
};

export function ToyButton({
  variant = "primary",
  size = "md",
  children,
  href,
  className,
  type = "button",
  disabled,
  id,
  form,
  onClick,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHaspopup,
}: ToyButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const shared = {
    id,
    className: cls,
    onClick,
    "aria-label": ariaLabel,
    "aria-expanded": ariaExpanded,
    "aria-haspopup": ariaHaspopup,
  };
  if (href) {
    if (href.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...shared}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} {...shared}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} form={form} {...shared}>
      {children}
    </button>
  );
}