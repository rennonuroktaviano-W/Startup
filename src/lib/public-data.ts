import "server-only";
import { prisma } from "@/lib/db";
import type { Faq, Service, ServiceTone } from "@/lib/content";
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
