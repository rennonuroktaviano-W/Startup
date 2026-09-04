import { siteConfig } from "@/lib/site";

const abs = (path: string) => `${siteConfig.siteUrl}${path}`;

type BreadcrumbItem = { name: string; path: string };

export function organizationJsonLd(opts?: { email?: string; sameAs?: string[] }) {
  const o = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
  } as Record<string, unknown>;
  if (opts?.email) o.email = opts.email;
  if (opts?.sameAs?.length) o.sameAs = opts.sameAs;
  return o;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  slug: string;
  serviceType?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: abs(`/services/${opts.slug}`),
    serviceType: opts.serviceType ?? opts.name,
    ...(opts.image ? { image: abs(opts.image) } : {}),
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.siteUrl },
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  image?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(`/insights/${opts.slug}`) },
    headline: opts.title,
    description: opts.description,
    image: abs(opts.image ?? "/brand/og-default.png"),
    datePublished: opts.publishedAt,
    author: { "@type": "Person", name: opts.authorName ?? siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
}