"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { type ServiceGoal, servicesList } from "@/lib/content";
import { ServiceCard } from "@/components/public/service-card";

const goals: Array<{ label: string; value: ServiceGoal | "Semua" }> = [
  { label: "Semua", value: "Semua" },
  { label: "Branding", value: "Branding" },
  { label: "Selling", value: "Selling" },
  { label: "Operations", value: "Operations" },
  { label: "Custom App", value: "Custom App" },
];

export function ServiceFilter() {
  const [active, setActive] = useState<ServiceGoal | "Semua">("Semua");
  const filtered =
    active === "Semua" ? servicesList : servicesList.filter((s) => s.goal === active);

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
        {filtered.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}