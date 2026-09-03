import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import { Reveal } from "@/components/motion/reveal";
import type { PublicTestimonial } from "@/lib/public-data";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const start = parts[0][0] ?? "";
  const end = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (start + end).toUpperCase();
}

export function TestimonialsSection({ items }: { items: PublicTestimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="relative overflow-hidden border-y-2 border-dashed border-ink/10 bg-white/40 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <SectionHeader
          sticker="Kata Mereka"
          tone="sky"
          title={
            <>
              Klien yang sudah <span className="text-sky">merasakan</span>
            </>
          }
          subtitle="Kutipan yang kami tampilkan hanya dari klien yang sudah memberi izin untuk dipublikasikan."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={Math.min(i, 3) * 0.05}>
              <figure className="flex h-full flex-col rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)]">
                <Quote className="h-6 w-6 text-sky" aria-hidden />
                <blockquote className="mt-3 text-[15px] leading-relaxed text-ink/80">“{t.quote}”</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-5">
                  {t.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.avatarUrl}
                      alt={`Foto ${t.personName}`}
                      className="h-11 w-11 rounded-full border-2 border-ink object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-sm font-bold text-ink">
                      {initials(t.personName)}
                    </span>
                  )}
                  <div>
                    <div className="font-display font-semibold text-ink">{t.personName}</div>
                    {(t.jobTitle || t.companyName) && (
                      <div className="text-xs font-medium text-ink/60">
                        {[t.jobTitle, t.companyName].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
