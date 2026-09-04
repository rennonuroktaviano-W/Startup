import type { Metadata } from "next";
import { Fredoka, Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { getPublicSettings, themeVariables } from "@/lib/public-settings";
import { organizationJsonLd } from "@/lib/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();
  const themeCss = themeVariables(settings.theme);
  const motionIntensity = settings.theme.intensity;
  const decorations = settings.theme.decorations;
  const htmlClass = [
    fredoka.variable,
    jakarta.variable,
    "h-full antialiased",
    `motion-${motionIntensity}`,
    decorations ? "" : "decorations-off",
  ]
    .filter(Boolean)
    .join(" ");

  const organizationSchema = organizationJsonLd({
    email: settings.contact.email,
    sameAs: [
      `https://wa.me/${settings.contact.whatsapp}`,
      ...settings.contact.social.map((s) => s.url),
    ],
  });

  return (
    <html lang="id" className={htmlClass}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{${themeCss};}` }} />
        <JsonLd data={organizationSchema} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}