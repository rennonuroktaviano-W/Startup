import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getPublishedArticle, getRelatedArticles } from "@/lib/content-articles";
import { extractHeadings, computeReadingMinutes } from "@/lib/headings";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/public/rich-text";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { TableOfContents } from "@/components/public/table-of-contents";
import { ShareLinks } from "@/components/public/share-links";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return buildMetadata({ title: "Artikel tidak ditemukan", noIndex: true });
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${slug}`,
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, related] = await Promise.all([
    getPublishedArticle(slug),
    getRelatedArticles(slug).catch(() => []),
  ]);
  if (!article) notFound();

  const headings = extractHeadings(article.body);
  const readingMinutes = article.readingMinutes ?? computeReadingMinutes(article.body);

  return (
    <>
      <JsonLd data={articleJsonLd({ title: article.title, description: article.excerpt, slug, publishedAt: article.publishedAt, image: article.coverUrl, authorName: article.authorName })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Insights", path: "/insights" }, { name: article.title, path: `/insights/${slug}` }])} />
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 pb-10 pt-32 md:px-10 md:pt-40">
          <Reveal>
            <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
              <Link href="/insights" className="hover:text-purple">
                Insights
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink/80">{article.title}</span>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink/55">
              {article.categoryName && (
                <span className="rounded-full border-2 border-ink bg-lemon px-3 py-1 text-xs font-bold text-ink">
                  {article.categoryName}
                </span>
              )}
              <span>{formatDate(article.publishedAt)}</span>
              <span className="text-ink/30">·</span>
              <span>{readingMinutes} menit baca</span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              {article.title}
            </h1>
            {article.excerpt && <p className="mt-4 text-lg leading-relaxed text-ink/70">{article.excerpt}</p>}
            {article.authorName && <p className="mt-3 text-sm font-semibold text-ink/55">Oleh {article.authorName}</p>}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 md:px-10">
        <Reveal>
          <TableOfContents headings={headings} />
          <RichText blocks={article.body} />
          <ShareLinks url={`/insights/${slug}`} title={article.title} />
        </Reveal>
      </section>

      {related.length > 0 && (
        <section className="border-t-2 border-dashed border-ink/15 bg-ink/[0.02] py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-10">
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
              <BookOpen className="h-6 w-6 text-purple" /> Baca juga
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((post) => (
                <Link
                  key={post.slug}
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
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-purple">
                    {post.title}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-purple">
                    Baca <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
