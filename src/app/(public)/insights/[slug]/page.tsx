import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedArticle } from "@/lib/content-articles";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/public/rich-text";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

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
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

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
              {article.readingMinutes && (
                <>
                  <span className="text-ink/30">·</span>
                  <span>{article.readingMinutes} menit baca</span>
                </>
              )}
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
          <RichText blocks={article.body} />
        </Reveal>
      </section>
    </>
  );
}
