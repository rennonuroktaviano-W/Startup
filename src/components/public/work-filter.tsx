"use client";

import { useMemo, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { type Project, type ProjectType } from "@/lib/content";
import { ProjectCard } from "@/components/public/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useAnalytics } from "@/components/analytics/analytics-provider";
import { cn } from "@/lib/utils";

export function WorkFilter({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [service, setService] = useState<string>("all");
  const [type, setType] = useState<"all" | ProjectType>("all");
  const { track } = useAnalytics();

  const trackFilter = (key: string, value: string) => {
    track("project_filter", { key, value });
  };

  const serviceOptions = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.services.map((s) => s.slug)))),
    [projects],
  );
  const serviceLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) for (const s of p.services) if (!map.has(s.slug)) map.set(s.slug, s.name);
    return map;
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
    if (service !== "all") list = list.filter((p) => p.services.some((s) => s.slug === service));
    if (type !== "all") list = list.filter((p) => p.projectType === type);
    return list;
  }, [projects, query, service, type]);

  const hasFilter = query !== "" || service !== "all" || type !== "all";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex min-w-56 flex-1 items-center">
          <span className="sr-only">Cari proyek</span>
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              trackFilter("query", e.target.value);
            }}
            placeholder="Cari judul atau ringkasan…"
            className="h-11 w-full rounded-full border-2 border-ink bg-surface pl-10 pr-4 text-sm font-medium text-ink placeholder:text-ink/40 focus-visible:outline-3 focus-visible:outline-purple"
          />
        </label>
        <select
          value={service}
          onChange={(e) => {
            setService(e.target.value);
            trackFilter("service", e.target.value);
          }}
          aria-label="Filter berdasarkan layanan"
          className="h-11 rounded-full border-2 border-ink bg-surface px-4 text-sm font-semibold text-ink"
        >
          <option value="all">Semua layanan</option>
          {serviceOptions.map((slug) => (
            <option key={slug} value={slug}>
              {serviceLabel.get(slug) ?? slug}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => {
            const v = e.target.value as "all" | ProjectType;
            setType(v);
            trackFilter("type", v);
          }}
          aria-label="Filter berdasarkan status proyek"
          className="h-11 rounded-full border-2 border-ink bg-surface px-4 text-sm font-semibold text-ink"
        >
          <option value="all">Client & Concept</option>
          <option value="CLIENT">Proyek klien</option>
          <option value="CONCEPT">Concept / Internal</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 filter-grid">
          {filtered.map((project) => (
            <div key={project.slug} className="animate-pop">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Tidak ada hasil"
            description="Coba kata kunci lain atau kosongkan filter."
            action={
              hasFilter ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setService("all");
                    setType("all");
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border-2 border-ink bg-lemon px-5 py-2.5 text-sm font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]",
                  )}
                >
                  <RotateCcw className="h-4 w-4" /> Reset filter
                </button>
              ) : undefined
            }
          />
        </div>
      )}
    </div>
  );
}