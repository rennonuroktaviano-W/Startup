import { Sparkle, Rocket, HandHeart, Focus } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { principles } from "@/lib/content";
import { SectionHeader } from "@/components/public/section-header";
import { ToyButton } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Tentang Kami",
  description:
    "KotakIde Studio adalah studio web kecil yang membantu bisnis berangkat dari ide menjadi produk digital yang enak dipakai. Kami: jelas, fleksibel, dan fokus.",
});

const advantage = [
  {
    Icon: Focus,
    tone: "bg-sky",
    title: "Komunikasi dekat",
    description: "Kamu ngobrol langsung dengan orang yang mengerjakan, bukan account manager perantara.",
  },
  {
    Icon: HandHeart,
    tone: "bg-mint",
    title: "Fleksibel",
    description: "Scope bisa disesuaikan kebutuhan dan anggaran tanpa paket kaku yang tidak masuk akal.",
  },
  {
    Icon: Rocket,
    tone: "bg-lemon",
    title: "Fokus",
    description: "Mengerjakan sedikit proyek dalam satu waktu supaya hasilnya benar-benar diperhatikan.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-32 md:px-10 md:pt-40">
          <SectionHeader
            sticker="Tentang Kami"
            tone="lemon"
            title={
              <>
                Studio web kecil yang mulai dari <span className="text-purple">satu ide</span>
              </>
            }
          />
          <Reveal className="mt-6 max-w-3xl">
            <p className="text-lg leading-relaxed text-ink/75">
              {siteConfig.name} lahir dari kegelisahan sederhana: banyak bisnis bagus yang sulit
              dipercaya hanya karena kehadiran digitalnya tidak rapi. Sebagian lagi punya website tapi
              tidak pernah bisa diubah lagi — atau terasa seperti template yang tidak mencerminkan
              isinya sama sekali.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              Kami berdiri untuk menjadi sisi teknis yang bersahabat: menjelaskan dengan bahasa
              sederhana, jujur soal proses dan biaya, serta mengutamakan hasil yang benar-benar
              dipakai — bukan sekadar tampilan yang diupload dan dibiarkan.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Kenapa memilih studio sekecil ini?
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {advantage.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border-2 border-ink bg-surface p-6 shadow-[4px_4px_0_0_var(--ink)]">
                <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink", a.tone)}>
                  <a.Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{a.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y-2 border-dashed border-ink/10 bg-white/40 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-10">
          <SectionHeader
            sticker="Cara Berpikir"
            tone="purple"
            title="Prinsip yang kami pegang di setiap proyek"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={Math.min(i, 2) * 0.05}>
                <div className="h-full rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10">
        <Reveal className="rounded-2xl border-2 border-ink bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-ink">Tim</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Saat ini {siteConfig.name} dijalankan oleh tim kecil. Halaman ini akan diperkenalkan
            dengan nama dan peran seiring tim bertumbuh dan disetujui untuk ditampilkan.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Desain & Pengembangan", "Strategi & Komunikasi"].map((role) => (
              <span key={role} className="rounded-full border-2 border-dashed border-ink/30 px-3 py-1 text-xs font-semibold text-ink/60">
                {role}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Cocok dengan cara kami kerja?</h2>
            <p className="mt-2 max-w-xl text-ink/70">
              Mulai dari percakapan ringan tanpa komitmen. Kami dengarkan dulu, baru membahas solusi.
            </p>
          </div>
          <ToyButton href="/contact" size="lg">
            Ngobrol dengan kami <Sparkle className="h-4 w-4" />
          </ToyButton>
        </Reveal>
      </section>
    </>
  );
}