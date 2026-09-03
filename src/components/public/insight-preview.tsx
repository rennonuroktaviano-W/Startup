import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import { Reveal } from "@/components/motion/reveal";
import type { ArticleSummary } from "@/lib/content-articles";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export function InsightPreview({ items }: { items: ArticleSummary[] }) {
  if (!items.length) return null;
  const posts = items.slice(0, 3);
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          sticker="Insight Terbaru"
          tone="mint"
          title={
            <>
              Catatan kecil yang <span className="text-mint">berguna</span>
            </>
          }
        />
        <Reveal>
          <Link
            href="/insights"
            className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-surface px-4 py-2 text-sm font-bold text-ink shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5"
          >
            Semua Insight <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={Math.min(i, 3) * 0.05}>
            <Link
              href={`/insights/${post.slug}`}
              className="group flex h-full flex-col gap-3 rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)]"
            >
              {post.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverUrl}
                  alt={post.title}
                  className="h-36 w-full rounded-xl border-2 border-ink object-cover"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center rounded-xl border-2 border-ink bg-purple/10">
                  <BookOpen className="h-8 w-8 text-purple" aria-hidden />
                </div>
              )}
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
    </section>
  );
}
