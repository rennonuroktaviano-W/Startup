import { notFound } from "next/navigation";
import { getPublishedArticle } from "@/lib/content-articles";
import { buildMetadata } from "@/lib/seo";

const posts: string[] = [];

export function generateStaticParams() {
  return posts.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) return buildMetadata({ title: "Artikel tidak ditemukan", noIndex: true });
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  notFound();
}