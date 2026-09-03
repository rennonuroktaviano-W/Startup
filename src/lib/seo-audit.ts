import "server-only";
import { prisma } from "@/lib/db";

const STATIC_PATHS = new Set([
  "/",
  "/services",
  "/work",
  "/about",
  "/process",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
]);

type SlugRow = { slug: string; status: string; deletedAt: Date | null };

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Low-pegangan resolver untuk tautan internal; mengabaikan eksternal/email/gambar. */
function parseInternalLinks(text: string): string[] {
  const out: string[] = [];
  const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = hrefRe.exec(text)) !== null) {
    const raw = m[1].trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    let path = raw;
    try {
      const url = new URL(raw, "http://localhost");
      if (url.origin !== "http://localhost" && url.origin !== "https://localhost") continue;
      path = url.pathname;
    } catch {
      continue;
    }
    if (!path.startsWith("/")) continue;
    if (/^\/(uploads|api|preview|admin|_next)\b/.test(path)) continue;
    out.push(path);
  }
  return out;
}

export type SeoAuditResult = {
  slugDuplicates: { slug: string; count: number }[];
  brokenLinks: { path: string; source: string }[];
  checkedAt: string;
};

export async function getSeoAudit(): Promise<SeoAuditResult> {
  const [pages, services, projects, posts] = await Promise.all([
    prisma.page.findMany({ select: { slug: true, status: true, deletedAt: true } }),
    prisma.service.findMany({ select: { slug: true, status: true, deletedAt: true } }),
    prisma.project.findMany({ select: { slug: true, status: true, deletedAt: true } }),
    prisma.blogPost.findMany({ select: { slug: true, status: true, deletedAt: true } }),
  ]);

  const collections: Record<string, SlugRow[]> = {
    Halaman: pages,
    Layanan: services,
    Proyek: projects,
    Artikel: posts,
  };
  const slugDuplicates: { slug: string; count: number }[] = [];
  for (const rows of Object.values(collections as Record<string, SlugRow[]>)) {
    const active = rows.filter((r) => r.status === "PUBLISHED" && !r.deletedAt);
    const seen = new Map<string, number>();
    for (const r of active) {
      const key = r.slug.toLowerCase();
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    for (const [slug, count] of seen) {
      if (count > 1) slugDuplicates.push({ slug, count });
    }
  }

  // Semua slug publik untuk resolusi path.
  const pageSlugs = new Set(pages.filter((p) => p.status === "PUBLISHED" && !p.deletedAt).map((p) => p.slug));
  const serviceSlugs = new Set(services.filter((s) => s.status === "PUBLISHED" && !s.deletedAt).map((s) => s.slug));
  const projectSlugs = new Set(projects.filter((p) => p.status === "PUBLISHED" && !p.deletedAt).map((p) => p.slug));
  const postSlugs = new Set(posts.filter((p) => p.status === "PUBLISHED" && !p.deletedAt).map((p) => p.slug));

  const [pageTexts, serviceTexts, projectTexts, postTexts] = await Promise.all([
    prisma.page.findMany({ where: { status: "PUBLISHED", deletedAt: null }, include: { sections: true } }),
    prisma.service.findMany({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.project.findMany({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED", deletedAt: null } }),
  ]);

  const sources: { text: string; label: string }[] = [];
  for (const p of pageTexts) {
    for (const sec of p.sections) sources.push({ text: asText(sec.contentJson), label: `Halaman /pages/${p.slug}` });
  }
  for (const s of serviceTexts) {
    sources.push({ text: asText(s.bodyJson), label: `Layanan /services/${s.slug}` });
  }
  for (const pr of projectTexts) {
    sources.push({
      text: [pr.challengeJson, pr.goalsJson, pr.approachJson, pr.highlightsJson, pr.outcomeJson, pr.summary]
        .map(asText)
        .join("\n"),
      label: `Proyek /work/${pr.slug}`,
    });
  }
  for (const po of postTexts) {
    sources.push({ text: [po.bodyJson, po.excerpt].map(asText).join("\n"), label: `Artikel /insights/${po.slug}` });
  }

  const brokenLinks: { path: string; source: string }[] = [];
  const seenBroken = new Set<string>();
  for (const src of sources) {
    for (const path of parseInternalLinks(src.text)) {
      if (STATIC_PATHS.has(path)) continue;
      const segs = path.split("/").filter(Boolean);
      if (segs.length === 2 && segs[0] === "pages" && pageSlugs.has(segs[1])) continue;
      if (segs.length === 2 && segs[0] === "services" && serviceSlugs.has(segs[1])) continue;
      if (segs.length === 2 && segs[0] === "work" && projectSlugs.has(segs[1])) continue;
      if (segs.length === 2 && segs[0] === "insights" && postSlugs.has(segs[1])) continue;
      const key = `${path}|${src.label}`;
      if (seenBroken.has(key)) continue;
      seenBroken.add(key);
      brokenLinks.push({ path, source: src.label });
    }
  }

  return { slugDuplicates, brokenLinks, checkedAt: new Date().toISOString() };
}
