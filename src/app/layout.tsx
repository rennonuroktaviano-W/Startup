import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { getPublicSettings } from "@/lib/public-settings";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteName = siteConfig.name;

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublicSettings();
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: seo.seoTitle,
      template: `%s — ${siteName}`,
    },
    description: seo.seoDescription,
    openGraph: {
      siteName,
      type: "website",
      locale: "id_ID",
      title: seo.seoTitle,
      description: seo.seoDescription,
      images: [{ url: new URL(seo.seoOgImage, siteConfig.siteUrl).toString() }],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteConfig.siteUrl,
  email: siteConfig.email,
  description: siteConfig.description,
  sameAs: [`https://wa.me/${siteConfig.whatsapp}`],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fredoka.variable} ${jakarta.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}