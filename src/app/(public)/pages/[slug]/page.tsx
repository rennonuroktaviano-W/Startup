import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

function toText(content: unknown, key: string, fallback = ""): string {
  if (content && typeof content === "object") {
    const val = (content as Record<string, unknown>)[key];
    return typeof val === "string" ? val : "";
  }
  return fallback;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || page.deletedAt) return buildMetadata({ title: "Halaman tidak ditemukan", noIndex: true });
  return buildMetadata({
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined,
    path: `/pages/${page.slug}`,
    noIndex: page.noIndex,
  });
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
  if (!page || page.deletedAt || page.status !== "PUBLISHED") notFound();

  const visible = page.sections.filter((s) => s.isVisible);

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-dashed border-ink/10">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-8 pt-28 md:px-10 md:pt-32">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Halaman</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">{page.title}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 md:px-10">
        {visible.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-ink/20 p-8 text-center text-sm text-ink/60">
            Belum ada konten untuk halaman ini.
          </p>
        ) : (
          <div className="space-y-8">
            {visible.map((s) => (
              <SectionBlock key={s.id} sectionType={s.sectionType} variant={s.variant} content={s.contentJson} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SectionBlock({ sectionType, variant, content }: { sectionType: string; variant: string; content: unknown }) {
  const heading = toText(content, "heading");
  const body = toText(content, "body");
  const eyebrow = toText(content, "eyebrow");
  const accent = variant === "accent" ? "bg-coral" : variant === "muted" ? "bg-mint" : variant === "bordered" ? "bg-sky" : "bg-surface";

  if (sectionType === "hero") {
    return (
      <div className={`rounded-3xl border-2 border-ink ${accent} p-8 shadow-[4px_4px_0_0_var(--ink)] md:p-12`}>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-ink/60">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">{heading}</h2>
        {body && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/75">{body}</p>}
      </div>
    );
  }

  if (sectionType === "cta") {
    return (
      <div className="rounded-3xl border-2 border-ink bg-purple p-8 text-center text-white shadow-[4px_4px_0_0_var(--ink)]">
        {heading && <h2 className="font-display text-2xl font-semibold md:text-3xl">{heading}</h2>}
        {body && <p className="mx-auto mt-3 max-w-xl text-white/80">{body}</p>}
      </div>
    );
  }

  if (sectionType === "grid" || sectionType === "split") {
    return (
      <div className={`rounded-3xl border-2 border-ink ${accent} p-6 sm:grid sm:grid-cols-2 sm:gap-6`}>
        <div>
          {eyebrow && <p className="text-xs font-bold uppercase tracking-widest text-ink/60">{eyebrow}</p>}
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{heading}</h2>
        </div>
        {body && <p className="mt-3 leading-relaxed text-ink/75 sm:mt-0">{body}</p>}
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border-2 border-ink ${accent} p-6`}>
      {heading && <h2 className="font-display text-2xl font-semibold text-ink">{heading}</h2>}
      {body && <p className="mt-3 leading-relaxed text-ink/75">{body}</p>}
    </div>
  );
}