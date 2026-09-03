import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { requireCapability } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  requireCapability(session.user.role, "audit:read");

  const snapshot: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    exportedBy: session.user.email,
    services: await prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    projects: await prisma.project.findMany({ orderBy: { createdAt: "asc" } }),
    blogPosts: await prisma.blogPost.findMany({ orderBy: { createdAt: "asc" } }),
    blogCategories: await prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    blogTags: await prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
    faqs: await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } }),
    testimonials: await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    clients: await prisma.client.findMany({ orderBy: { name: "asc" } }),
    teamMembers: await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    pages: await prisma.page.findMany({
      where: { deletedAt: null },
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    }),
    redirects: await prisma.redirect.findMany({ orderBy: { createdAt: "asc" } }),
    settings: await prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
  };

  await logAudit({
    actorId: session.user.id,
    action: "backup",
    entityType: "Backup",
    summary: { keys: Object.keys(snapshot) },
  });

  const json = JSON.stringify(snapshot, null, 2);
  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="kotakide-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}