import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageForm } from "@/components/admin/cms/page-form";
import { SectionManager } from "@/components/admin/cms/section-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Halaman — Admin" };

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit: {page.title}</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">Meta & status</h2>
        <PageForm
          initial={{
            id: page.id,
            title: page.title,
            slug: page.slug,
            pageType: page.pageType,
            status: page.status,
            metaTitle: page.metaTitle ?? "",
            metaDescription: page.metaDescription ?? "",
            canonicalUrl: page.canonicalUrl ?? "",
            noIndex: page.noIndex,
          }}
        />
      </div>
      <div className="mt-6 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">Komposisi bagian</h2>
        <SectionManager
          pageId={page.id}
          sections={page.sections.map((s) => ({
            id: s.id,
            sectionType: s.sectionType,
            variant: s.variant,
            contentJson: s.contentJson,
            sortOrder: s.sortOrder,
            isVisible: s.isVisible,
          }))}
        />
      </div>
    </div>
  );
}