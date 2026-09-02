"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in" />
        <RadixDialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--ink)] focus:outline-none",
            className,
          )}
        >
          {children}
          <RadixDialog.Close asChild>
            <button
              type="button"
              aria-label="Tutup"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-surface transition-colors hover:bg-lemon"
            >
              <X className="h-4 w-4" />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export const DialogTitle = ({ className, ...rest }: ComponentProps<typeof RadixDialog.Title>) => (
  <RadixDialog.Title className={cn("font-display text-xl font-semibold", className)} {...rest} />
);

export const DialogDescription = (props: ComponentProps<typeof RadixDialog.Description>) => (
  <RadixDialog.Description className="mt-1 text-sm text-ink/70" {...props} />
);