import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { getPublishedArticles } from "@/lib/content-articles";
import { SectionHeader } from "@/components/public/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Insights",
  description:
    "Artikel dan tips seputar website, web app, dan digital marketing dari KotakIde Studio.",
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function InsightsPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-32 md:px-10 md:pt-40">
          <SectionHeader
            sticker="Insight"
            tone="purple"
            title={
              <>
                Catatan & tips seputar <span className="text-purple">digital</span>
              </>
            }
            subtitle="Artikel, studi singkat, dan pembaruan studio. Kami memilih menulis yang benar-benar berguna dibanding membanjiri halaman dengan artikel demi tampak ramai."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        {articles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((post, i) => (
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
          <Reveal>
            <EmptyState
              icon={<BookOpen className="h-6 w-6" />}
              tone="purple"
              title="Insight pertama sedang dipersiapkan"
              description={`Kami lebih suka merilis tulisan saat benar-benar siap, termasuk yang berasal dari pembelajaran proyek nyata. Pantau terus lewat ${siteConfig.email} atau kunjungi halaman ini lagi.`}
            />
          </Reveal>
        )}
      </section>
    </>
  );
}
