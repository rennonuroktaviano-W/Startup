import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CircleDollarSign, Clock3, Users } from "lucide-react";
import { getPublishedService } from "@/lib/public-data";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { type Tone, toneBg, toneSoft } from "@/lib/tone";
import { TrackOnce } from "@/components/analytics/track-once";
import { ToyButton } from "@/components/ui/button";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublishedService(slug);
  if (!service) return buildMetadata({ title: "Layanan tidak ditemukan", noIndex: true });
  return buildMetadata({
    title: service.name,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getPublishedService(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const tone = service.tone as Tone;

  return (
    <>
      <TrackOnce event="service_view" props={{ slug: service.slug }} />
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-32 md:px-10 md:pt-36">
          <nav aria-label="Breadcrumb" className="text-sm text-ink/50">
            <Link href="/services" className="hover:text-purple">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/80">{service.name}</span>
          </nav>
          <Reveal className="mt-6 max-w-3xl">
            <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink", toneBg[tone])}>
              <Icon className="h-7 w-7" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">{service.shortDescription}</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/70">{service.longDescription}</p>
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap gap-3">
            <ToyButton href={`/contact?type=${service.slug}`} size="lg">
              Diskusikan {service.name}
            </ToyButton>
            <ToyButton href="/work" variant="secondary" size="lg">
              Lihat Karya
            </ToyButton>
          </Reveal>
        </div>
      </section>

      {/* Facts */}
      <section className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Reveal className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <Users className="h-5 w-5 text-purple" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink/50">Cocok untuk</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{service.targetClient}</p>
          </Reveal>
          <Reveal delay={0.05} className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <Clock3 className="h-5 w-5 text-sky" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink/50">Estimasi waktu</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{service.timelineText}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <CircleDollarSign className="h-5 w-5 text-mint" />
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink/50">Harga</p>
            <p className="mt-1 text-sm leading-relaxed text-ink">
              {service.priceMode === "PRICED" && service.startingPrice
                ? service.startingPrice
                : "Harga berdasarkan scope — dihitung setelah kebutuhan jelas."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Problems solved */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Masalah yang biasa kami bantu selesaikan
            </h2>
            <ul className="mt-6 space-y-3">
              {service.problemsSolved.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/75">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-coral text-[10px] font-bold">!</span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Apa yang kamu dapat</h2>
            <div className="mt-6 space-y-4">
              {service.deliverables.map((d) => (
                <div key={d.title} className="flex items-start gap-3 rounded-xl border-2 border-ink bg-white p-4 shadow-[3px_3px_0_0_var(--ink)]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{d.title}</p>
                    <p className="mt-0.5 text-sm text-ink/70">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process + outcome */}
      <section className="border-y-2 border-dashed border-ink/10 bg-white/40 py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-10">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Alur pengerjaan</h2>
            <ol className="mt-6 space-y-0">
              {service.process.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink font-display text-sm font-bold", toneBg[tone])}>
                      {i + 1}
                    </span>
                    {i < service.process.length - 1 && <span className="w-0.5 grow border-l-2 border-dashed border-ink/30" />}
                  </div>
                  <div className="pb-8">
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.05}>
            <div className={cn("rounded-2xl border-2 border-ink p-6 shadow-[4px_4px_0_0_var(--ink)]", toneSoft[tone])}>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Hasil akhir</p>
              <p className="mt-3 font-display text-xl font-semibold leading-snug text-ink">{service.outcome}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Service FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-14 md:py-16">
        <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
          Seputar layanan ini
        </h2>
        <div className="mt-8">
          <FaqAccordion items={service.serviceFaqs} />
        </div>
      </section>
    </>
  );
}