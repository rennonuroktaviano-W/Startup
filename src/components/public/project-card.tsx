import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Project } from "@/lib/content";
import { ArtFrame } from "@/components/public/art";

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)]",
        className,
      )}
    >
      <ArtFrame kind={project.cover.art} label={project.cover.label} className="aspect-[16/10] w-full" />
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {project.projectType === "CONCEPT" && (
            <span className="rounded-full border-2 border-ink bg-coral px-2 py-0.5 text-ink">Concept / Internal Experiment</span>
          )}
          <span className="bg-surface text-ink/60">{project.industry}</span>
          <span className="text-ink/40">·</span>
          <span className="text-ink/60">{project.year}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-ink group-hover:text-purple">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/70">{project.summary}</p>
      </div>
    </Link>
  );
}