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

  return {
    seoTitle: stringOr("seo.title", `${siteConfig.name} — Studio Website & Aplikasi`),
    seoDescription: stringOr("seo.description", siteConfig.defaultOgDescription),
    seoOgImage: stringOr("seo.og_image", "/brand/og-default.png"),
  };
}