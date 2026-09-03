import "server-only";
import { prisma } from "@/lib/db";

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categoryName?: string;
  readingMinutes?: number;
};

export type ArticleBlock = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ArticleBlock[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
};

export type Article = ArticleSummary & {
  body: ArticleBlock;
  authorName?: string;
};

function publishedAt(date: Date | null, scheduledAt: Date | null): Date {
  const base = date ?? scheduledAt ?? new Date();
  return base;
}

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { not: null, lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
    include: {
      categories: { include: { category: true } },
      author: { select: { name: true } },
    },
  });
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    publishedAt: publishedAt(p.publishedAt, p.scheduledAt).toISOString(),
    categoryName: p.categories[0]?.category.name ?? undefined,
    readingMinutes: p.readingMinutes ?? undefined,
  }));
}

export async function getPublishedArticle(slug: string): Promise<Article | undefined> {
  const p = await prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { not: null, lte: new Date() },
    },
    include: {
      categories: { include: { category: true } },
      author: { select: { name: true } },
    },
  });
  if (!p) return undefined;
  const body = (typeof p.bodyJson === "object" && p.bodyJson !== null ? p.bodyJson : { type: "doc", content: [] }) as ArticleBlock;
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    publishedAt: publishedAt(p.publishedAt, p.scheduledAt).toISOString(),
    categoryName: p.categories[0]?.category.name ?? undefined,
    readingMinutes: p.readingMinutes ?? undefined,
    body,
    authorName: p.author?.name ?? undefined,
  };
}
