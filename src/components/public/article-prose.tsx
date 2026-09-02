import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function ArticleProse({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-grain absolute inset-0" />
      <article className="relative mx-auto max-w-3xl px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <Reveal>
          <p className="text-sm text-ink/50">Terakhir diperbarui — {updatedAt}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <div className="mt-8 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:leading-relaxed [&_p]:leading-relaxed [&_p]:text-ink/75 [&_li]:text-ink/75">
            {children}
          </div>
        </Reveal>
      </article>
    </div>
  );
}