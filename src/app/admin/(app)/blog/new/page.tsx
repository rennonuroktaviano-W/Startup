import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/cms/blog-post-form";

export const metadata = { title: "Tambah Artikel — Admin" };

export default async function NewBlogPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.blogCategory.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tambah Artikel Baru</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <BlogPostForm categories={categories} tags={tags} />
      </div>
    </div>
  );
}