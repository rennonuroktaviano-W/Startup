"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import type { ArticleSummary } from "@/lib/content-articles";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export function InsightsBrowser({
  articles,
  categories,
}: {
  articles: ArticleSummary[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((post) => {
      const matchCategory = category === "Semua" || post.categoryName === category;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.categoryName ?? "").toLowerCase().includes(q)
      );
    });
  }, [articles, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel…"
            aria-label="Cari artikel"
            className="w-full rounded-full border-2 border-ink bg-surface py-2 pl-9 pr-4 text-sm font-medium text-ink outline-none transition-colors focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter artikel berdasarkan kategori">
          <SlidersHorizontal className="hidden h-4 w-4 text-ink/40 sm:block" />
          {["Semua", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border-2 border-ink px-3 py-1 text-xs font-semibold transition-all",
                category === c ? "bg-purple text-white shadow-[2px_2px_0_0_var(--ink)]" : "bg-surface hover:bg-ink/5",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i, 3) * 0.05}>
              <Link
                href={`/insights/${post.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)]"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink/55">
                  {post.categoryName && (
                    <span className="rounded-full border-2 border-ink bg-lemon px-2.5 py-0.5 text-ink">
                      {post.categoryName}
                    </span>
                  )}
                  <span>{formatDate(post.publishedAt)}</span>
                  {post.readingMinutes && (
                    <>
                      <span className="text-ink/30">·</span>
                      <span>{post.readingMinutes} menit</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-xl font-semibold leading-snug text-ink group-hover:text-purple">
                  {post.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-purple">
                  Baca selengkapnya <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-ink/60">
          Tidak ada artikel yang cocok dengan pencarian ini.
        </p>
      )}
    </div>
  );
}
