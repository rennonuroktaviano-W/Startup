export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categoryName?: string;
  readingMinutes?: number;
};

export type Article = ArticleSummary & {
  body: { blocks: unknown[] };
  authorName?: string;
};

export function getPublishedArticles(): ArticleSummary[] {
  return [];
}

export function getPublishedArticle(slug: string): Article | undefined {
  void slug;
  return undefined;
}