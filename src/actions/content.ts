"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { getRequiredSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { saveRevision } from "@/lib/revisions";
import { upsertRedirect } from "@/lib/redirects";

// --- BLOG POST ---

const blogSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  bodyJson: z.string().min(2, "Body wajib diisi."),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional(),
  publishedAt: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
  readingMinutes: z.coerce.number().optional().nullable(),
  categoryIds: z.string().array().optional(),
  tagIds: z.string().array().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredMediaId: z.string().optional().nullable(),
  noIndex: z.boolean().optional(),
});

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export async function upsertBlogPost(input: z.infer<typeof blogSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = blogSchema.parse(input);
  const { id, categoryIds, tagIds, ...rest } = p;
  const data = {
    title: rest.title,
    slug: rest.slug ?? slugify(rest.title),
    excerpt: rest.excerpt,
    bodyJson: JSON.parse(rest.bodyJson),
    status: rest.status ?? "DRAFT",
    publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
    scheduledAt: rest.scheduledAt ? new Date(rest.scheduledAt) : null,
    readingMinutes: rest.readingMinutes,
    metaTitle: rest.metaTitle,
    metaDescription: rest.metaDescription,
    featuredMediaId: rest.featuredMediaId ?? null,
    noIndex: rest.noIndex ?? false,
    authorId: session.user.id,
  };
  const record = id
    ? await prisma.blogPost.update({ where: { id }, data })
    : await prisma.blogPost.create({ data });
  if (categoryIds) {
    await prisma.postCategory.deleteMany({ where: { postId: record.id } });
    if (categoryIds.length)
      await prisma.postCategory.createMany({ data: categoryIds.map((c) => ({ postId: record.id, categoryId: c })) });
  }
  if (tagIds) {
    await prisma.postTag.deleteMany({ where: { postId: record.id } });
    if (tagIds.length)
      await prisma.postTag.createMany({ data: tagIds.map((t) => ({ postId: record.id, tagId: t })) });
  }
  if (id) {
    const prev = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
    if (prev && prev.slug !== record.slug) {
      await upsertRedirect(`/blog/${prev.slug}`, `/blog/${record.slug}`);
    }
  }
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "BlogPost", entityId: record.id, summary: { title: data.title, status: data.status } });
  await saveRevision("BlogPost", record.id, session.user.id, {
    ...data,
    bodyJson: data.bodyJson ?? null,
    categoryIds: categoryIds ?? [],
    tagIds: tagIds ?? [],
  });
  return { ok: true, id: record.id };
}

export async function deleteBlogPost(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.blogPost.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "BlogPost", entityId: id });
  return { ok: true };
}

export async function togglePublishBlogPost(id: string, status: "DRAFT" | "PUBLISHED") {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:publish");
  const updated = await prisma.blogPost.update({ where: { id }, data: { status } });
  await logAudit({ actorId: session.user.id, action: "publish", entityType: "BlogPost", entityId: id, summary: { status } });
  return { ok: true, status: updated.status };
}

// --- FAQ ---

const faqSchema = z.object({
  id: z.string().cuid().optional(),
  question: z.string().min(2),
  answerJson: z.string().min(2),
  category: z.enum(["GENERAL", "PROCESS", "PRICING", "SERVICE"]),
  serviceId: z.string().optional().nullable(),
  pageId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

export async function upsertFaq(input: z.infer<typeof faqSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = faqSchema.parse(input);
  const { id, ...rest } = p;
  const data = {
    question: rest.question,
    answerJson: JSON.parse(rest.answerJson),
    category: rest.category,
    serviceId: rest.serviceId ?? null,
    pageId: rest.pageId ?? null,
    sortOrder: rest.sortOrder ?? 0,
    status: rest.status ?? "PUBLISHED",
  };
  const record = id ? await prisma.fAQ.update({ where: { id }, data }) : await prisma.fAQ.create({ data });
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "FAQ", entityId: record.id });
  return { ok: true, id: record.id };
}

export async function deleteFaq(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.fAQ.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "FAQ", entityId: id });
  return { ok: true };
}

// --- TESTIMONIAL ---

const testimonialSchema = z.object({
  id: z.string().cuid().optional(),
  personName: z.string().min(1),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  quote: z.string().min(2),
  consentStatus: z.enum(["PENDING_PERMISSION", "APPROVED", "DENIED"]).optional(),
  status: z.enum(["PENDING_PERMISSION", "PUBLISHED", "HIDDEN"]).optional(),
  sortOrder: z.coerce.number().optional(),
  avatarMediaId: z.string().optional().nullable(),
});

export async function upsertTestimonial(input: z.infer<typeof testimonialSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = testimonialSchema.parse(input);
  const { id, ...rest } = p;
  const data = {
    personName: rest.personName,
    jobTitle: rest.jobTitle ?? null,
    companyName: rest.companyName ?? null,
    quote: rest.quote,
    consentStatus: rest.consentStatus ?? "PENDING_PERMISSION",
    status: rest.status ?? "PENDING_PERMISSION",
    sortOrder: rest.sortOrder ?? 0,
    avatarMediaId: rest.avatarMediaId ?? null,
  };
  const record = id ? await prisma.testimonial.update({ where: { id }, data }) : await prisma.testimonial.create({ data });
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "Testimonial", entityId: record.id });
  return { ok: true, id: record.id };
}

export async function deleteTestimonial(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.testimonial.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Testimonial", entityId: id });
  return { ok: true };
}

// --- CLIENT ---

const clientSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  websiteUrl: z.string().url().optional().nullable(),
  logoMediaId: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
});

export async function upsertClient(input: z.infer<typeof clientSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = clientSchema.parse(input);
  const { id, ...rest } = p;
  const data = {
    name: rest.name,
    websiteUrl: rest.websiteUrl ?? null,
    logoMediaId: rest.logoMediaId ?? null,
    isPublic: rest.isPublic ?? true,
    sortOrder: rest.sortOrder ?? 0,
  };
  const record = id ? await prisma.client.update({ where: { id }, data }) : await prisma.client.create({ data });
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "Client", entityId: record.id });
  return { ok: true, id: record.id };
}

export async function deleteClient(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.client.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "Client", entityId: id });
  return { ok: true };
}

// --- TEAM ---

const teamSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1),
  roleTitle: z.string().min(1),
  bio: z.string().optional(),
  photoMediaId: z.string().optional().nullable(),
  socialJson: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  sortOrder: z.coerce.number().optional(),
});

export async function upsertTeamMember(input: z.infer<typeof teamSchema>) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  const p = teamSchema.parse(input);
  const { id, ...rest } = p;
  const data = {
    name: rest.name,
    roleTitle: rest.roleTitle,
    bio: rest.bio ?? null,
    photoMediaId: rest.photoMediaId ?? null,
    status: rest.status ?? "ACTIVE",
    sortOrder: rest.sortOrder ?? 0,
    socialJson: rest.socialJson ? JSON.parse(rest.socialJson) : null,
  };
  const record = id ? await prisma.teamMember.update({ where: { id }, data }) : await prisma.teamMember.create({ data });
  await logAudit({ actorId: session.user.id, action: id ? "update" : "create", entityType: "TeamMember", entityId: record.id });
  return { ok: true, id: record.id };
}

export async function deleteTeamMember(id: string) {
  const session = await getRequiredSession();
  requireCapability(session.user.role, "content:write");
  await prisma.teamMember.delete({ where: { id } });
  await logAudit({ actorId: session.user.id, action: "delete", entityType: "TeamMember", entityId: id });
  return { ok: true };
}

// --- BLOG CATEGORY / TAG ---

const categorySchema = z.object({ id: z.string().optional(), name: z.string().min(1), slug: z.string().optional(), description: z.string().optional() });
export async function upsertBlogCategory(input: z.infer<typeof categorySchema>) {
  const s = await getRequiredSession(); requireCapability(s.user.role, "content:write");
  const { id, ...rest } = categorySchema.parse(input);
  const data = { ...rest, slug: rest.slug ?? slugify(rest.name) };
  const r = id ? await prisma.blogCategory.update({ where: { id }, data }) : await prisma.blogCategory.create({ data });
  await logAudit({ actorId: s.user.id, action: id ? "update" : "create", entityType: "BlogCategory", entityId: r.id });
  return { ok: true, id: r.id };
}

const tagSchema = z.object({ id: z.string().optional(), name: z.string().min(1), slug: z.string().optional() });
export async function upsertBlogTag(input: z.infer<typeof tagSchema>) {
  const s = await getRequiredSession(); requireCapability(s.user.role, "content:write");
  const { id, ...rest } = tagSchema.parse(input);
  const data = { ...rest, slug: rest.slug ?? slugify(rest.name) };
  const r = id ? await prisma.blogTag.update({ where: { id }, data }) : await prisma.blogTag.create({ data });
  await logAudit({ actorId: s.user.id, action: id ? "update" : "create", entityType: "BlogTag", entityId: r.id });
  return { ok: true, id: r.id };
}

export async function deleteBlogCategory(id: string) {
  const s = await getRequiredSession(); requireCapability(s.user.role, "content:write");
  const count = await prisma.postCategory.count({ where: { categoryId: id } });
  if (count > 0) return { ok: false, error: `Kategori masih dipakai ${count} artikel. Hapus relasinya dulu.` } as const;
  await prisma.blogCategory.delete({ where: { id } });
  await logAudit({ actorId: s.user.id, action: "delete", entityType: "BlogCategory", entityId: id });
  return { ok: true } as const;
}

export async function deleteBlogTag(id: string) {
  const s = await getRequiredSession(); requireCapability(s.user.role, "content:write");
  const count = await prisma.postTag.count({ where: { tagId: id } });
  if (count > 0) return { ok: false, error: `Tag masih dipakai ${count} artikel. Hapus relasinya dulu.` } as const;
  await prisma.blogTag.delete({ where: { id } });
  await logAudit({ actorId: s.user.id, action: "delete", entityType: "BlogTag", entityId: id });
  return { ok: true } as const;
}

// --- PAGE SECTIONS (generic) ---

const sectionSchema = z.object({
  id: z.string().cuid().optional(),
  pageId: z.string().cuid().min(1),
  sectionType: z.string().min(1),
  variant: z.string().optional(),
  contentJson: z.string().optional(),
  styleJson: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isVisible: z.boolean().optional(),
});

export async function upsertPageSection(input: z.infer<typeof sectionSchema>) {
  const s = await getRequiredSession(); requireCapability(s.user.role, "content:write");
  const { id, ...rest } = sectionSchema.parse(input);
  const data = {
    pageId: rest.pageId,
    sectionType: rest.sectionType,
    variant: rest.variant ?? "default",
    contentJson: rest.contentJson ? (JSON.parse(rest.contentJson) as never) : {},
    styleJson: rest.styleJson ? (JSON.parse(rest.styleJson) as never) : undefined,
    sortOrder: rest.sortOrder ?? 0,
    isVisible: rest.isVisible ?? true,
  } as never; // spread may drop pageId exclusivity
  const r = id ? await prisma.pageSection.update({ where: { id }, data }) : await prisma.pageSection.create({ data });
  await logAudit({ actorId: s.user.id, action: id ? "update" : "create", entityType: "PageSection", entityId: r.id });
  return { ok: true, id: r.id };
}