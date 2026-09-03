import { prisma } from "@/lib/db";
import { CategoryTagManager } from "@/components/admin/cms/category-tag-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Kategori Artikel — Admin" };

export default async function BlogCategoriesAdminPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Kategori Artikel</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <CategoryTagManager
          kind="category"
          items={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, usage: c._count.posts }))}
        />
      </div>
    </div>
  );
}