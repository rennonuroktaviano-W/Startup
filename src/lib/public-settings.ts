import "server-only";

import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

/**
 * Membaca pengaturan global yang bisa diubah admin dan dibutuhkan oleh
 * layout/publik. Hanya membaca SiteSetting dengan `isPublic=true` untuk mencegah
 * bocornya nilai internal. Menghindari error bila DB tidak siap (mis. saat build
 * awal/static export) dengan fallback ke siteConfig statis.
 */
export async function getPublicSettings() {
  let rows: { key: string; valueJson: unknown }[] = [];
  try {
    rows = await prisma.siteSetting.findMany({
      where: { isPublic: true },
      select: { key: true, valueJson: true },
    });
  } catch {
    rows = [];
  }

  const raw = Object.fromEntries(
    rows.map((r) => [
      r.key,
      typeof r.valueJson === "string" ? r.valueJson : r.valueJson,
    ]),
  );

  const stringOr = (key: string, fallback: string) =>
    typeof raw[key] === "string" && (raw[key] as string).length > 0 ? (raw[key] as string) : fallback;

  const colorOr = (key: string, fallback: string) => {
    const v = stringOr(key, fallback);
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim()) ? v : fallback;
  };

  const social: { platform: string; url: string }[] = Array.isArray(raw["contact.social"])
    ? (raw["contact.social"] as { platform: string; url: string }[]).filter(
        (s) => s && typeof s.url === "string" && s.url.length > 0,
      )
    : [];

  const story: string[] = Array.isArray(raw["about.story"])
    ? (raw["about.story"] as string[]).filter((s) => typeof s === "string" && s.length > 0)
    : [];

  return {
    brand: {
      name: stringOr("app.name", siteConfig.name),
      tagline: stringOr("app.tagline", siteConfig.tagline),
      description: stringOr("app.description", siteConfig.defaultOgDescription),
    },
    about: { story },
    contact: {
      email: stringOr("contact.email", siteConfig.email),
      whatsapp: stringOr("contact.whatsapp", siteConfig.whatsapp),
      whatsappDisplay: stringOr("contact.whatsapp_display", siteConfig.whatsappDisplay),
      responseTime: stringOr("contact.response_time", siteConfig.responseTime),
      address: stringOr("contact.address", ""),
      businessHours: stringOr("contact.business_hours", ""),
      social,
    },
    seoTitle: stringOr("seo.title", `${siteConfig.name} — Studio Website & Aplikasi`),
    seoDescription: stringOr("seo.description", siteConfig.defaultOgDescription),
    seoOgImage: stringOr("seo.og_image", "/brand/og-default.png"),
    theme: {
      ink: colorOr("theme.ink", "#17132b"),
      paper: colorOr("theme.paper", "#fff9f3"),
      purple: colorOr("theme.purple", "#7357ff"),
      lemon: colorOr("theme.lemon", "#ffd84d"),
      coral: colorOr("theme.coral", "#ff6b72"),
      sky: colorOr("theme.sky", "#62d8ff"),
      mint: colorOr("theme.mint", "#66e2a6"),
      surface: colorOr("theme.surface", "#ffffff"),
      danger: colorOr("theme.danger", "#d9364f"),
      intensity: ["calm", "playful", "extra"].includes(raw["theme.intensity"] as string)
        ? (raw["theme.intensity"] as string)
        : "playful",
      decorations: raw["theme.decorations"] === "off" ? false : true,
    },
  };
}

export function themeVariables(theme: {
  ink: string;
  paper: string;
  purple: string;
  lemon: string;
  coral: string;
  sky: string;
  mint: string;
  surface: string;
  danger: string;
}): string {
  return [
    `--ink:${theme.ink}`,
    `--paper:${theme.paper}`,
    `--purple:${theme.purple}`,
    `--lemon:${theme.lemon}`,
    `--coral:${theme.coral}`,
    `--sky:${theme.sky}`,
    `--mint:${theme.mint}`,
    `--surface:${theme.surface}`,
    `--danger:${theme.danger}`,
  ].join(";");
}