import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border-2 border-ink bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/40 shadow-[2px_2px_0_0_var(--ink)] focus:outline-none focus:ring-[3px] focus:ring-purple focus:ring-offset-0 disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[2px_2px_0_0_var(--danger)]";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "appearance-none pr-9", className)} {...rest}>
      {children}
    </select>
  );
}

export function Label({ className, ...rest }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-1.5 block text-sm font-semibold text-ink", className)} {...rest} />
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-danger" role="alert">
      {children}
    </p>
  );
}