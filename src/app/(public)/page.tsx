import { Sparkle } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { principles } from "@/lib/content";
import { getPublishedServices, getPublishedFaqs, getPublishedProjects } from "@/lib/public-data";
import { buildMetadata } from "@/lib/seo";
import { ToyButton } from "@/components/ui/button";
import { SectionHeader } from "@/components/public/section-header";
import { ServiceCard } from "@/components/public/service-card";
import { ProjectCard } from "@/components/public/project-card";
import { ProcessRoad } from "@/components/public/process-road";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { BeforeAfter } from "@/components/public/before-after";
import { HeroVisual, ScrollHint } from "@/components/public/hero-visual";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Studio Website & Web App",
  description: siteConfig.description,
});

export default async function HomePage() {
  const [services, homeFaqs, projects] = await Promise.all([
    getPublishedServices(),
    getPublishedFaqs(),
    getPublishedProjects(),
  ]);
  const featured = projects.filter((p) => p.projectType === "CONCEPT" || true).slice(0, 3);
  const hasWork = featured.length > 0;
  const hasServices = services.length > 0;

  return (
    <>
      {/* ---- Hero ---- */}
      <section data-motion-hero className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-10 pt-28 md:grid-cols-[1.1fr_1fr] md:items-center md:px-10 md:pb-16 md:pt-36">
          <Reveal className="order-2 md:order-1">
            <p className="toy-sticker -rotate-1 bg-sky">{siteConfig.tagline}</p>
            <h1 className="mt-5 font-display text-[2.4rem] font-semibold leading-[1.06] text-ink sm:text-5xl md:text-[3.4rem]">
              Dari ide kecil jadi{" "}
              <span className="relative inline-block text-purple">
                produk digital
                <svg viewBox="0 0 120 24" fill="none" aria-hidden className="absolute -bottom-1.5 left-0 w-full">
                  <path d="M3 12c10-14 20 14 30 0s20-14 30 0 20 14 30 0 20-14 27-1" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              yang enak dipakai.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70 sm:text-lg">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ToyButton href="/contact" size="lg">
                Ceritain Ide Kamu <Sparkle className="h-4 w-4" />
              </ToyButton>
              <ToyButton href="/work" variant="secondary" size="lg">
                Lihat Karya
              </ToyButton>
            </div>
          </Reveal>
          <Reveal className="order-1 md:order-2" delay={0.1}>
            <HeroVisual />
          </Reveal>
        </div>
        <ScrollHint />
      </section>

      {/* ---- Service Playground ---- */}
      <section id="layanan" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-10 md:py-24">
        <SectionHeader
          sticker="Yang Kami Kerjakan"
          tone="purple"
          title={
            <>
              Layanan di atas meja{" "}
              <span className="text-purple">digital</span> kami
            </>
          }
          subtitle="Setiap layanan dirancang sebagai solusi nyata, bukan sekadar jasa pasang template. Pilih yang paling cocok dengan kondisi kamu."
        />
        {hasServices ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={Math.min(i, 3) * 0.05}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink/60">Belum ada layanan yang diterbitkan.</p>
        )}
      </section>

      {/* ---- Before / After ---- */}
      <section className="relative overflow-hidden border-y-2 border-dashed border-ink/10 bg-white/40 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-10">
          <Reveal>
            <SectionHeader
              sticker="Kenapa Perlu Dibersihkan?"
              tone="coral"
              title={
                <>
                  Masalah berantakan jadi <span className="text-coral">produk rapi</span>
                </>
              }
              subtitle="Informasi tercecer di banyak tempat membuat pengunjung bingung dan meninggalkan halamanmu. Kami menyusunnya ulang jadi pengalaman yang jelas."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Hierarki informasi yang mudah dipindai dalam beberapa detik.",
                "Alur pengunjung yang mengarah ke satu tindakan jelas.",
                "Tampilan konsisten di ponsel, tablet, dan desktop.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/75">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint text-[10px] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      {/* ---- Selected Work ---- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            sticker="Karya"
            tone="sky"
            title={
              <>
                Eksperimen yang <span className="text-sky">jujur</span>
              </>
            }
            subtitle="Klien nyata menyusul. Sambil menunggu, kami mendokumentasikan eksperimen internal sebagai bukti pendekatan kerja."
          />
          <Reveal>
            <ToyButton href="/work" variant="secondary">
              Semua Karya →
            </ToyButton>
          </Reveal>
        </div>
        {hasWork ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {featured.map((project) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink/60">Belum ada karya untuk ditampilkan.</p>
        )}
      </section>

      {/* ---- Process ---- */}
      <section className="relative overflow-hidden border-y-2 border-dashed border-ink/10 bg-white/40 py-20 md:py-24">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-10">
          <SectionHeader
            sticker="Cara Kami Bekerja"
            tone="mint"
            align="center"
            title={
              <>
                Proses sejelas <span className="text-mint">permainan</span>, seserius kerja nyata
              </>
            }
            subtitle="Empat fase singkat yang membuatmu tahu kapan sesuatu harus disetujui dan apa yang kamu terima di tiap langkah."
          />
          <div className="mt-12">
            <ProcessRoad />
          </div>
        </div>
      </section>

      {/* ---- Principles ---- */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 md:py-24">
        <SectionHeader
          sticker="Prinsip"
          tone="lemon"
          align="center"
          title={
            <>
              Pegangan kami saat <span className="text-purple">bekerja</span>
            </>
          }
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={Math.min(i, 3) * 0.05}>
              <div className="h-full rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- FAQ ---- */}
      <section className="relative overflow-hidden border-t-2 border-dashed border-ink/10 bg-white/40 py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <SectionHeader
            sticker="Tanya Jawab"
            tone="coral"
            align="center"
            title={
              <>
                Pertanyaan yang sering <span className="text-coral">muncul</span>
              </>
            }
          />
          <div className="mt-10">
            <FaqAccordion items={homeFaqs} />
          </div>
          <Reveal className="mt-8 text-center">
            <p className="text-ink/70">
              Masih bingung?{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-purple underline underline-offset-4">
                {siteConfig.email}
              </a>{" "}
              siap dihubungi.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}