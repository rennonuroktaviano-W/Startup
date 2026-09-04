import Link from "next/link";
import { Mail, MessageCircle, Instagram, Linkedin, Github, Globe } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { getPublicSettings } from "@/lib/public-settings";
import { ToyButton } from "@/components/ui/button";
import { Sparkle, Squiggle } from "@/components/public/shapes";

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
};

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  website: "Website",
};

export async function ClosingPlayground() {
  const settings = await getPublicSettings();
  const { contact, brand } = settings;
  return (
    <section aria-label="Mulai proyek" className="relative overflow-hidden">
      <div className="bg-grain absolute inset-0" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-28 pt-24 text-center md:pb-16">
        <p className="toy-sticker mb-6 rotate-1 bg-mint">Punya ide? Mari ngobrol.</p>

        <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">
          Dari ide kecil jadi
          <br />
          <span className="relative inline-block text-purple">
            produk digital
            <Squiggle className="absolute -bottom-2 left-0 w-full text-coral" />
          </span>{" "}
          yang enak dipakai.
        </h2>

        <p className="mt-6 max-w-xl text-base text-ink/70 sm:text-lg">
          Ceritakan kebutuhanmu lewat project brief singkat, atau langsung ngobrol dengan kami di
          WhatsApp. Tanpa jargon, tanpa komitmen.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ToyButton href="/contact" size="lg">
            Isi Project Brief <Sparkle className="h-4 w-4" />
          </ToyButton>
          <ToyButton href={whatsappLink("Halo KotakIde Studio, saya mau konsultasi soal proyek.", contact.whatsapp)} variant="secondary" size="lg">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </ToyButton>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 border-t-2 border-dashed border-ink/15 pt-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-ink/70">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 underline decoration-purple decoration-2 underline-offset-4 hover:text-purple">
              <Mail className="h-4 w-4" /> {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink/70">
            {contact.social.map(({ platform, url }) => {
              const key = platform.toLowerCase();
              const Icon = socialIcons[key] ?? Globe;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabels[key] ?? platform}
                  title={socialLabels[key] ?? platform}
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/20 transition-colors hover:border-ink hover:bg-lemon"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-sm text-ink/70">
            <Link href="/privacy" className="underline decoration-ink/40 underline-offset-4 hover:text-purple">
              Privasi
            </Link>
            <Link href="/terms" className="underline decoration-ink/40 underline-offset-4 hover:text-purple">
              Ketentuan
            </Link>
          </div>
        </div>

        <p className="mt-8 text-sm text-ink/50">
          © {new Date().getFullYear()} {brand.name}. Dibuat dengan banyak kopi & rasa penasaran.
        </p>
      </div>
    </section>
  );
}