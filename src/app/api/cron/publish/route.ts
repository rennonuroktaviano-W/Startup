import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const due = await prisma.blogPost.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { not: null, lte: now },
      deletedAt: null,
    },
    select: { id: true, slug: true, publishedAt: true, scheduledAt: true },
  });

  let published = 0;
  for (const post of due) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        status: "PUBLISHED",
        publishedAt: post.publishedAt ?? post.scheduledAt,
      },
    });
    await logAudit({
      actorId: null,
      action: "publish",
      entityType: "BlogPost",
      entityId: post.id,
      summary: { trigger: "cron-scheduled", slug: post.slug },
    });
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/insights");
    published += 1;
  }

  return NextResponse.json({ ok: true, published, checkedAt: now.toISOString() });
}
