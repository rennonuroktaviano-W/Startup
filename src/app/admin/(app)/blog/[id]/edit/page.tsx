import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/cms/blog-post-form";
import { RevisionHistory } from "@/components/admin/cms/revision-history";
import { listRevisions } from "@/lib/revisions";
import { PreviewLink } from "@/components/admin/cms/preview-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { title: true } });
  return { title: post ? `Edit ${post.title} — Admin` : "Artikel tidak ditemukan" };
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, include: { categories: true, tags: true } });
  if (!post) notFound();
  const [categories, tags, revisions] = await Promise.all([
    prisma.blogCategory.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    listRevisions("BlogPost", id),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit: {post.title}</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <BlogPostForm
          categories={categories}
          tags={tags}
          initial={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt ?? "",
            bodyJson: JSON.stringify(post.bodyJson, null, 2),
            status: post.status,
            metaTitle: post.metaTitle ?? "",
            metaDescription: post.metaDescription ?? "",
            categoryIds: post.categories.map((c) => c.categoryId),
            tagIds: post.tags.map((t) => t.tagId),
          }}
        />
      </div>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <PreviewLink entityType="BlogPost" entityId={post.id} />
      </div>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <RevisionHistory
          revisions={revisions.map((r) => ({
            id: r.id,
            versionNumber: r.versionNumber,
            createdAt: r.createdAt,
            author: r.author,
          }))}
        />
      </div>
    </div>
  );
}