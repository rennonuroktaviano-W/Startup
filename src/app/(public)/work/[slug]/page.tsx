import Link from "next/link";
import { notFound } from "next/navigation";
import { Target } from "lucide-react";
import { getProject, projectsList } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ToyButton } from "@/components/ui/button";
import { ArtFrame } from "@/components/public/art";
import { ProjectCard } from "@/components/public/project-card";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return buildMetadata({ title: "Proyek tidak ditemukan", noIndex: true });
  const label = project.projectType === "CONCEPT" ? "Concept / Internal Experiment" : "Karya Klien";
  return buildMetadata({
    title: `${project.title} (${label})`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = projectsList.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-32 md:px-10 md:pt-36">
          <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
            <Link href="/work" className="hover:text-purple">
              Work
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/80">{project.title}</span>
          </nav>
          <Reveal className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              {project.projectType === "CONCEPT" && (
                <span className="rounded-full border-2 border-ink bg-coral px-3 py-1 text-xs font-bold text-ink">
                  Concept / Internal Experiment
                </span>
              )}
              <span className="text-sm text-ink/60">{project.industry}</span>
              <span className="text-ink/40">·</span>
              <span className="text-sm text-ink/60">{project.year}</span>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">{project.summary}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 md:px-10">
        <Reveal>
          <ArtFrame kind={project.cover.art} label={project.cover.label} className="aspect-[16/9] w-full" />
        </Reveal>

        {/* Facts */}
        <Reveal className="mt-8">
          <div className="flex flex-wrap gap-3">
            {project.services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-full border-2 border-ink bg-sky px-4 py-1.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
              <Target className="h-5 w-5 text-coral" /> Tantangan
            </h2>
            <p className="mt-3 leading-relaxed text-ink/75">{project.challenge}</p>
            <h3 className="mt-6 font-display text-lg font-semibold text-ink">Tujuan</h3>
            <ul className="mt-3 space-y-2">
              {project.goals.map((g) => (
                <li key={g} className="flex items-start gap-2 text-[15px] leading-relaxed text-ink/75">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
              <RouteIcon /> Pendekatan
            </h2>
            <p className="mt-3 leading-relaxed text-ink/75">{project.approach}</p>
            <h3 className="mt-6 font-display text-lg font-semibold text-ink">Highlight eksekusi</h3>
            <ul className="mt-3 space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[15px] leading-relaxed text-ink/75">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mint" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-10">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Cuplikan visual</h2>
        </Reveal>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {project.galleryArts.map((art, i) => (
            <Reveal key={art.label} delay={i * 0.05}>
              <ArtFrame kind={art.art} label={art.label} className="aspect-[16/10] w-full" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y-2 border-dashed border-ink/10 bg-white/40 py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-5 md:px-10">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Hasil</p>
            <p className="mt-3 font-display text-2xl font-semibold leading-snug text-ink">{project.outcome}</p>
          </Reveal>
          {project.metrics.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
                  <p className="font-display text-3xl font-bold text-purple">{m.value}</p>
                  <p className="mt-1 text-sm text-ink/70">{m.label}</p>
                  {m.sourceNote && <p className="mt-1 text-xs text-ink/50">{m.sourceNote}</p>}
                </div>
              ))}
            </div>
          )}
          <Reveal className="mt-10">
            <ToyButton href={`/contact?type=${project.slug}`} size="lg">
              Punya tantangan serupa? Ceritakan
            </ToyButton>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 py-14 md:px-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Proyek lain</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function RouteIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5 text-sky">
    <path d="M5 12h4l2-6 4 12 2-6h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}