"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function BeforeAfter() {
  const [value, setValue] = useState(50);

  return (
    <div className="rounded-2xl border-2 border-ink bg-surface p-4 shadow-[4px_4px_0_0_var(--ink)] sm:p-6">
      <div className="pointer-events-none relative select-none overflow-hidden rounded-xl border-2 border-ink">
        {/* After (underneath) */}
        <div aria-hidden className="relative aspect-[16/10] w-full bg-sky/15">
          <MockTidy />
        </div>
        {/* Before (clipped) */}
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden bg-coral/15"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <MockMessy />
        </div>
        {/* Divider */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-1 bg-ink"
          style={{ left: `${value}%`, transform: "translateX(-50%)" }}
        />
        <span
          className="pointer-events-none absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface font-display text-sm font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]"
          style={{ left: `${value}%`, transform: "translate(-50%, -50%)" }}
        >
          ◂▸
        </span>
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border-2 border-ink bg-paper px-2.5 py-1 text-xs font-bold text-ink">
          Sebelum
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border-2 border-ink bg-mint px-2.5 py-1 text-xs font-bold text-ink">
          Sesudah
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span className="text-sm font-semibold text-ink/60">Sebelum</span>
        <Slider.Root
          className="relative flex h-6 flex-1 touch-none select-none items-center"
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={(v) => setValue(v[0])}
          aria-label="Bandingkan sebelum dan sesudah"
        >
          <Slider.Track className="relative h-2.5 flex-1 rounded-full border-2 border-ink bg-paper">
            <Slider.Range className="absolute h-full rounded-full bg-purple/60" />
          </Slider.Track>
          <Slider.Thumb className="block h-6 w-6 cursor-grab rounded-full border-2 border-ink bg-lemon shadow-[2px_2px_0_0_var(--ink)] focus-visible:outline-3 focus-visible:outline-purple active:cursor-grabbing" />
        </Slider.Root>
        <span className="text-sm font-semibold text-ink/60">Sesudah</span>
      </div>

      <p className="mt-3 text-sm text-ink/50">
        Geser untuk melihat bagaimana informasi yang tercecer disusun kembali menjadi website yang jelas.
      </p>
    </div>
  );
}

function MockMessy() {
  return (
    <div className="absolute inset-0 p-4 sm:p-6">
      <div className="flex items-center gap-2 opacity-80">
        <span className="h-3 w-16 rotate-[-4deg] rounded-full border-2 border-ink bg-coral/60" />
        <span className="h-3 w-10 rotate-[3deg] rounded-full border border-ink/30 bg-sky/50" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[40, 60, 30, 50, 45, 55, 35, 48].map((w, i) => (
          <span
            key={i}
            className="h-2.5 rounded-full border border-ink/15 bg-coral/25"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={cn("h-10 rounded-lg border border-ink/20 bg-ink/5", i % 3 === 0 && "rotate-[-3deg]", i % 3 === 2 && "rotate-[2deg]")}
          />
        ))}
      </div>
      <span className="absolute bottom-4 right-4 rotate-[-5deg] rounded-full border-2 border-ink bg-coral px-2.5 py-1 text-[11px] font-bold text-ink opacity-80">
        di mana produknya?
      </span>
    </div>
  );
}

function MockTidy() {
  return (
    <div className="absolute inset-0 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="h-4 w-24 rounded-full bg-ink/20" />
        <div className="flex gap-1.5">
          <span className="h-4 w-10 rounded-full bg-ink/10" />
          <span className="h-4 w-10 rounded-full bg-ink/10" />
          <span className="h-4 w-12 rounded-full bg-purple text-[9px] font-bold text-white" />
        </div>
      </div>
      <div className="mt-5 max-w-[70%]">
        <span className="block h-5 w-full rounded-full bg-ink/25" />
        <span className="mt-2 block h-3 w-2/3 rounded-full bg-ink/10" />
        <span className="mt-6 block h-8 w-28 rounded-full bg-purple" />
      </div>
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 sm:bottom-6 sm:left-6 sm:right-6">
        {["Layanan", "Karya", "Hubungi"].map((label, i) => (
          <span
            key={label}
            className={cn(
              "flex h-10 items-center justify-center rounded-xl border-2 border-ink font-display text-xs font-semibold sm:text-sm",
              i === 0 && "bg-sky",
              i === 1 && "bg-lemon",
              i === 2 && "bg-mint",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}