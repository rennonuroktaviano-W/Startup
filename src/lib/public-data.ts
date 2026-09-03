import "server-only";
import { prisma } from "@/lib/db";
import type { Faq, Project, ProjectMetric, Service, ServiceTone } from "@/lib/content";
import { serviceMeta, serviceProcess, serviceOutcome, serviceFaqs as serviceFaqsBySlug } from "@/lib/design-meta";

function processDefault(slug: string) {
  return serviceProcess(slug);
}

function processOutcome(slug: string) {
  return serviceOutcome(slug);
}

function serviceFaqs(slug: string): { question: string; answer: string }[] {
  return serviceFaqsBySlug(slug);
}

export async function getPublishedServices(): Promise<Service[]> {
  const rows = await prisma.service.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { sortOrder: "asc" },
    include: { deliverables: { orderBy: { sortOrder: "asc" } } },
  });
  return rows.map((s) => {
    const meta = serviceMeta(s.slug);
    const longDescription = typeof s.bodyJson === "string" ? s.bodyJson : "";
    const problems = Array.isArray(s.problemsSolved) ? (s.problemsSolved as string[]) : [];
    const target = s.targetClient ?? "Bisnis yang membutuhkan solusi ini.";
    return {
      slug: s.slug,
      name: s.name,
      icon: meta.icon,
      tone: meta.tone as ServiceTone,
      goal: meta.goal,
      shortDescription: s.shortDescription,
      longDescription,
      targetClient: target,
      problemsSolved: problems,
      deliverables: s.deliverables.map((d) => ({ title: d.title, description: d.description ?? "" })),
      process: processDefault(s.slug),
      timelineText: s.timelineText ?? "Disesuaikan dengan kebutuhan",
      priceMode: s.priceMode === "PRICED" ? "PRICED" : "BY_SCOPE",
      startingPrice: s.startingPrice ? String(s.startingPrice) : undefined,
      priceLabel: s.priceLabel ?? undefined,
      outcome: processOutcome(s.slug),
      serviceFaqs: serviceFaqs(s.slug),
    };
  });
}

export async function getPublishedService(slug: string): Promise<Service | undefined> {
  return (await getPublishedServices()).find((s) => s.slug === slug);
}

export async function getPublishedFaqs(): Promise<Faq[]> {
  const rows = await prisma.fAQ.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const cats: Record<string, Faq["category"]> = {
    GENERAL: "General",
    SERVICE: "Service",
    PROCESS: "Process",
    PRICING: "Pricing",
  };
  return rows.map((f) => ({
    question: f.question,
    answer: typeof f.answerJson === "string" ? f.answerJson : "",
    category: cats[f.category] ?? "General",
  }));
}

export type PublicTeamMember = {
  id: string;
  name: string;
  roleTitle: string;
  bio: string | null;
  photoUrl: string | null;
  social: { platform: string; url: string }[];
};

export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  const rows = await prisma.teamMember.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
  const photos = await prisma.mediaAsset.findMany({
    where: { id: { in: rows.map((m) => m.photoMediaId).filter(Boolean) as string[] } },
  });
  const photoUrl = new Map(photos.map((p) => [p.id, p.publicUrl]));
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    roleTitle: m.roleTitle,
    bio: m.bio,
    photoUrl: m.photoMediaId ? (photoUrl.get(m.photoMediaId) ?? null) : null,
    social: Array.isArray(m.socialJson) ? (m.socialJson as { platform: string; url: string }[]) : [],
  }));
}

export async function getPublicClients(): Promise<{ id: string; name: string; websiteUrl: string | null; logoUrl: string | null }[]> {
  const rows = await prisma.client.findMany({ where: { isPublic: true, deletedAt: null }, orderBy: { sortOrder: "asc" } });
  const mediaIds = rows.map((c) => c.logoMediaId).filter(Boolean) as string[];
  const logos = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
  const logoUrl = new Map(logos.map((l) => [l.id, l.publicUrl]));
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    websiteUrl: c.websiteUrl,
    logoUrl: c.logoMediaId ? (logoUrl.get(c.logoMediaId) ?? null) : null,
  }));
}

export type PublicTestimonial = {
  id: string;
  personName: string;
  jobTitle: string | null;
  companyName: string | null;
  quote: string;
  avatarUrl: string | null;
};

export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED", deletedAt: null, consentStatus: "APPROVED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const mediaIds = rows.map((t) => t.avatarMediaId).filter(Boolean) as string[];
  const avatars = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
  const avatarUrl = new Map(avatars.map((a) => [a.id, a.publicUrl]));
  return rows.map((t) => ({
    id: t.id,
    personName: t.personName,
    jobTitle: t.jobTitle,
    companyName: t.companyName,
    quote: t.quote,
    avatarUrl: t.avatarMediaId ? (avatarUrl.get(t.avatarMediaId) ?? null) : null,
  }));
}

export type PublicMetric = {
  label: string;
  value: string;
  unit: string | null;
  sourceNote: string | null;
};

export async function getPublicMetrics(): Promise<PublicMetric[]> {
  const rows = await prisma.projectMetric.findMany({
    where: { project: { status: "PUBLISHED", deletedAt: null } },
    orderBy: [{ projectId: "asc" }, { sortOrder: "asc" }],
    select: { label: true, value: true, unit: true, sourceNote: true },
  });
  const seen = new Set<string>();
  const out: PublicMetric[] = [];
  for (const m of rows) {
    if (!m.label || !m.value) continue;
    const signature = `${m.label}|${m.value}|${m.unit ?? ""}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    out.push({ label: m.label, value: m.value, unit: m.unit, sourceNote: m.sourceNote });
  }
  return out.slice(0, 8);
}

/** Resolve a stored JSON column that may be a string, an already-parsed array, or a JSON-encoded string. */
function readList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
    } catch {
      return [trimmed];
    }
  }
  return [];
}

function readText(value: unknown): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    try {
      const parsed = JSON.parse(trimmed);
      return typeof parsed === "string" ? parsed : Array.isArray(parsed) ? parsed.join("\n") : trimmed;
    } catch {
      return trimmed;
    }
  }
  return "";
}

/** Derive the ArtFrame kind for a project when no real media cover exists. */
function artForProject(slug: string, industry?: string | null): "browser" | "dashboard" | "phone" {
  const hay = `${slug} ${industry ?? ""}`.toLowerCase();
  if (/(kasir|pos|phone|mobile|tablet|app)/.test(hay)) return "phone";
  if (/(dashboard|admin|cms|analytics|panel|report)/.test(hay)) return "dashboard";
  return "browser";
}

export type PublicProject = Project;

interface ProjectRow {
  slug: string;
  title: string;
  projectType: string;
  industry: string | null;
  year: number | null;
  summary: string | null;
  challengeJson: unknown;
  goalsJson: unknown;
  approachJson: unknown;
  highlightsJson: unknown;
  outcomeJson: unknown;
  projectServices: { serviceId: string; service: { slug: string; name: string } | null }[];
  projectMetrics: { label: string; value: string; unit: string | null; sourceNote: string | null }[];
  projectMedia: { layoutVariant: string | null; caption: string | null; sortOrder: number }[];
}

async function projectToPublic(row: ProjectRow): Promise<Project> {
  const services = row.projectServices
    .map((ps) => ({ slug: ps.service?.slug ?? ps.serviceId, name: ps.service?.name ?? ps.serviceId }))
    .filter((s) => s.slug);
  const metrics: ProjectMetric[] = row.projectMetrics
    .map((m) => ({ label: m.label, value: m.value, sourceNote: m.sourceNote ?? undefined }))
    .filter((m) => m.label && m.value);
  const coverArt = artForProject(row.slug, row.industry);
  return {
    slug: row.slug,
    title: row.title,
    projectType: row.projectType as "CLIENT" | "CONCEPT",
    industry: row.industry ?? "",
    year: row.year ?? new Date().getFullYear(),
    summary: row.summary ?? "",
    challenge: readText(row.challengeJson),
    goals: readList(row.goalsJson),
    approach: readText(row.approachJson),
    highlights: readList(row.highlightsJson),
    outcome: readText(row.outcomeJson),
    metrics,
    services,
    cover: { label: `${row.title} — Visual utama`, art: coverArt },
    galleryArts: row.projectMedia
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((pm) => ({
        label: pm.caption ?? "Cuplikan proyek",
        art: artForProject(pm.layoutVariant ?? "", row.industry),
      })),
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    include: {
      projectServices: { include: { service: { select: { slug: true, name: true } } } },
      projectMetrics: { orderBy: { sortOrder: "asc" } },
      projectMedia: { orderBy: { sortOrder: "asc" } },
    },
  });
  return Promise.all(rows.map((row) => projectToPublic(row)));
}

export async function getPublishedProject(slug: string): Promise<Project | undefined> {
  const row = await prisma.project.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      projectServices: { include: { service: { select: { slug: true, name: true } } } },
      projectMetrics: { orderBy: { sortOrder: "asc" } },
      projectMedia: { orderBy: { sortOrder: "asc" } },
    },
  });
  return row ? projectToPublic(row) : undefined;
}
