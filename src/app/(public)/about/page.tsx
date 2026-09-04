import Image from "next/image";
import { Sparkle, Rocket, HandHeart, Focus, Github, Linkedin, Globe } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { principles } from "@/lib/content";
import { getPublicTeam, getPublicClients } from "@/lib/public-data";
import { getPublicSettings } from "@/lib/public-settings";
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

function SocialLink({ platform, url }: { platform: string; url: string }) {
  const key = platform.toLowerCase();
  const Icon = key.includes("github") ? Github : key.includes("linkedin") ? Linkedin : Globe;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${platform}`}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink/70 transition-colors hover:bg-lemon hover:text-ink"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

export default async function AboutPage() {
  const [team, clients, settings] = await Promise.all([
    getPublicTeam(),
    getPublicClients(),
    getPublicSettings(),
  ]);
  const story = settings.about.story.length
    ? settings.about.story
    : [
        `${siteConfig.name} lahir dari kegelisahan sederhana: banyak bisnis bagus yang sulit dipercaya hanya karena kehadiran digitalnya tidak rapi. Sebagian lagi punya website tapi tidak pernah bisa diubah lagi — atau terasa seperti template yang tidak mencerminkan isinya sama sekali.`,
        `Kami berdiri untuk menjadi sisi teknis yang bersahabat: menjelaskan dengan bahasa sederhana, jujur soal proses dan biaya, serta mengutamakan hasil yang benar-benar dipakai — bukan sekadar tampilan yang diupload dan dibiarkan.`,
      ];
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
            {story.map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-4 text-lg leading-relaxed text-ink/75" : "text-lg leading-relaxed text-ink/75"}>
                {paragraph}
              </p>
            ))}
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
        <SectionHeader sticker="Tim" tone="mint" title="Orang di balik kotak ide" align="center" />
        {team.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.id} delay={Math.min(i, 3) * 0.05}>
                <div className="flex h-full flex-col rounded-2xl border-2 border-ink bg-surface p-6 shadow-[4px_4px_0_0_var(--ink)]">
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-2xl border-2 border-ink bg-ink/10 object-cover"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-lemon font-display text-2xl font-bold">
                      {m.name.charAt(0)}
                    </span>
                  )}
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">{m.name}</h3>
                  <p className="text-sm font-semibold text-purple">{m.roleTitle}</p>
                  {m.bio && <p className="mt-2 text-sm leading-relaxed text-ink/70">{m.bio}</p>}
                  {m.social.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {m.social.map((s) => (
                        <SocialLink key={s.platform} platform={s.platform} url={s.url} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-8">
            <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-surface/60 p-6 text-center">
              <p className="text-sm text-ink/70">
                Saat ini {siteConfig.name} dijalankan oleh tim kecil. Anggota akan diperkenalkan di
                sini dengan nama dan peran seiring tim bertumbuh dan disetujui untuk ditampilkan.
              </p>
            </div>
          </Reveal>
        )}

        {clients.length > 0 && (
          <Reveal className="mt-12">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Klien yang pernah bekerja sama</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {clients.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-bold text-ink"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <Reveal>
          <div className="rounded-3xl bg-ink p-8 text-center md:p-12">
            <h2 className="font-display text-2xl font-semibold text-paper">Cocok dengan cara kami kerja?</h2>
            <p className="mx-auto mt-2 max-w-xl text-paper/70">
              Mulai dari percakapan ringan tanpa komitmen. Kami dengarkan dulu, baru membahas solusi.
            </p>
            <div className="mt-6 flex justify-center">
              <ToyButton href="/contact" size="lg">
                Ngobrol dengan kami <Sparkle className="h-4 w-4" />
              </ToyButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}