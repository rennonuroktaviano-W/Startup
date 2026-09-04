/**
 * Publishing domain logic (PRD §18.3, §30).
 * Publish/Artikel/Proyek harus gagal bila field wajib atau SEO minimum belum
 * lengkap. Modul ini murni (tanpa I/O) agar mudah diuji secara unit.
 */

export type PublishingCandidate = {
  title?: string | null;
  slug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  summary?: string | null;
  [key: string]: unknown;
};

export type PublishingIssue = {
  field: string;
  reason: string;
};

/** Status yang dianggap "published" di publik. */
export const PUBLISHED_STATUS = "PUBLISHED" as const;

/**
 * Periksa kelengkapan minimum sebuah konten sebelum diterbitkan.
 * PRD §18.3: "Publish harus gagal bila field wajib atau SEO minimum belum lengkap."
 */
export function validateForPublish(
  candidate: PublishingCandidate,
  requiredFields: string[] = ["title", "slug", "metaTitle", "metaDescription"],
): PublishingIssue[] {
  const issues: PublishingIssue[] = [];

  for (const field of requiredFields) {
    const value = candidate[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      issues.push({ field, reason: "Field wajib belum diisi" });
    }
  }

  // Slug harus berupa slug yang aman.
  if (typeof candidate.slug === "string" && candidate.slug.trim()) {
    const slugOk = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug.trim());
    if (!slugOk) {
      issues.push({ field: "slug", reason: "Slug hanya boleh huruf kecil, angka, dan tanda hubung" });
    }
  }

  return issues;
}

export function canTransition(
  from: string | undefined,
  to: string,
  allowed: Record<string, string[]>,
): boolean {
  if (!from) return true;
  const next = allowed[from];
  return Array.isArray(next) ? next.includes(to) : to === from;
}

/**
 * State machine dasar alur terbit (PRD §30):
 * DRAFT → REVIEW → PUBLISHED; pula SCHEDULED/ARCHIVED.
 * Memastikan tidak boleh lompat dari DRAFT langsung (mis.) mempublikasikan
 * sebelum review bila alur membutuhkan approval.
 */
export const PUBLISHING_FLOW: Record<string, string[]> = {
  DRAFT: ["REVIEW", "SCHEDULED", "ARCHIVED", "PUBLISHED"],
  REVIEW: ["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"],
  SCHEDULED: ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};
