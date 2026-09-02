import { Mail, MessageCircle, Clock3 } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/section-header";
import { ProjectBriefForm } from "@/components/forms/project-brief";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Project Brief",
  description:
    "Isi project brief singkat dalam 4 langkah untuk memulai diskusi proyek website, web app, atau dashboard bersama KotakIde Studio.",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="relative overflow-hidden">
      <div className="bg-grain absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 pb-36 pt-32 md:px-10 md:pb-20 md:pt-40">
        <SectionHeader
          sticker="Project Brief"
          tone="coral"
          title={
            <>
              Ceritakan ide kamu dalam <span className="text-coral">4 langkah</span>
            </>
          }
          subtitle="Kami butuh informasi cukup untuk konsultasi pertama yang bermakna. Tidak ada isian yang bertele-tele, dan datanya tidak hilang saat kamu berpindah langkah."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <ProjectBriefForm prefillType={sp.type ?? ""} />
          </Reveal>

          <Reveal delay={0.1} className="lg:pt-10">
            <div className="space-y-4">
              <a
                href={whatsappLink("Halo KotakIde Studio, saya mau tanya-tanya soal proyek.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-mint">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">WhatsApp</span>
                  <span className="block text-sm text-ink/60">{siteConfig.whatsappDisplay}</span>
                </span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-sky">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">Email</span>
                  <span className="block text-sm text-ink/60">{siteConfig.email}</span>
                </span>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink/30 bg-surface/70 p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-lemon">
                  <Clock3 className="h-5 w-5" />
                </span>
                <p className="text-sm text-ink/70">
                  {siteConfig.responseTime}. Formulir ini juga tersimpan otomatis saat kamu kirim.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}