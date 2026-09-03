"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Globe, MousePointerClick, AppWindow, LayoutDashboard, SwatchBook, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceGoal } from "@/lib/content";
import { toneBg, toneSoft } from "@/lib/tone";

const ICONS = {
  Globe,
  MousePointerClick,
  AppWindow,
  LayoutDashboard,
  SwatchBook,
  Wrench,
} as const;

export type ServiceCardInput = {
  slug: string;
  name: string;
  iconKey: keyof typeof ICONS;
  tone: "purple" | "lemon" | "sky" | "mint" | "coral";
  goal: ServiceGoal;
  shortDescription: string;
  targetClient: string;
};

const goals: Array<{ label: string; value: ServiceGoal | "Semua" }> = [
  { label: "Semua", value: "Semua" },
  { label: "Branding", value: "Branding" },
  { label: "Selling", value: "Selling" },
  { label: "Operations", value: "Operations" },
  { label: "Custom App", value: "Custom App" },
];

export function ServiceFilter({ services }: { services: ServiceCardInput[] }) {
  const [active, setActive] = useState<ServiceGoal | "Semua">("Semua");
  const filtered =
    active === "Semua" ? services : services.filter((s) => s.goal === active);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter layanan berdasarkan tujuan">
        {goals.map((g) => (
          <button
            key={g.value}
            type="button"
            role="tab"
            aria-selected={active === g.value}
            onClick={() => setActive(g.value)}
            className={cn(
              "rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition-all",
              active === g.value
                ? "bg-purple text-white shadow-[2px_2px_0_0_var(--ink)]"
                : "bg-surface hover:bg-ink/5",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => {
          const Icon = ICONS[service.iconKey] ?? Globe;
          return (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col gap-4 rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)]"
            >
              <div className="flex items-center justify-between">
                <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink", toneBg[service.tone])}>
                  <Icon className="h-6 w-6" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">{service.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{service.shortDescription}</p>
              </div>
              <div className={cn("rounded-xl px-3 py-2 text-sm font-semibold", toneSoft[service.tone])}>
                Cocok untuk: {service.targetClient.split(",")[0]}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}