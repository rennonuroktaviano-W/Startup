"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RadixSelect({
  value,
  onValueChange,
  children,
  placeholder,
  className,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
  className?: string;
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "inline-flex h-11 items-center justify-between gap-2 rounded-xl border-2 border-ink bg-surface px-3.5 text-sm font-medium text-ink",
          "shadow-[2px_2px_0_0_var(--ink)] focus:outline-none focus:ring-[3px] focus:ring-purple",
          "data-[placeholder]:text-ink/40",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-ink/50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-64 overflow-auto rounded-xl border-2 border-ink bg-surface shadow-[4px_4px_0_0_var(--ink)]"
        >
          <SelectPrimitive.Viewport className="p-1">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export function RadixSelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink outline-none",
        "data-[highlighted]:bg-lemon data-[state=checked]:bg-purple/10",
        className,
      )}
    >
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5 text-purple" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
