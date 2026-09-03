import { prisma } from "@/lib/db";
import { CategoryTagManager } from "@/components/admin/cms/category-tag-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tag Artikel — Admin" };

export default async function BlogTagsAdminPage() {
  const tags = await prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tag Artikel</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <CategoryTagManager
          kind="tag"
          items={tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug, usage: t._count.posts }))}
        />
      </div>
    </div>
  );
}