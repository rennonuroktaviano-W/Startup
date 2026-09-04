import { getPublishedArticles } from "@/lib/content-articles";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "KotakIde Studio";
const description = "Artikel dan tips seputar website, web app, dan digital marketing dari KotakIde Studio.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = await getPublishedArticles();
  const items = articles
    .slice(0, 20)
    .map((a) => {
      const link = `${siteUrl}/insights/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      ${a.categoryName ? `<category>${escapeXml(a.categoryName)}</category>` : ""}
      <description>${escapeXml(a.excerpt || "")}</description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} — Insights</title>
    <link>${escapeXml(siteUrl)}/insights</link>
    <description>${escapeXml(description)}</description>
    <language>id</language>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=900",
    },
  });
}
