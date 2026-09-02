import { siteConfig } from "@/lib/site";
import { ToyButton } from "@/components/ui/button";
import { Sparkle } from "@/components/public/shapes";

export default function HomePage() {
  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <div className="bg-grain absolute inset-0" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center px-5 pb-28 pt-32 md:px-10 md:pt-40">
        <p className="toy-sticker -rotate-1 bg-sky">{siteConfig.tagline}</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl md:text-6xl">
          Dari ide kecil jadi{" "}
          <span className="relative inline-block text-purple">
            produk digital
            <svg viewBox="0 0 120 24" fill="none" aria-hidden className="absolute -bottom-2 left-0 w-full">
              <path d="M3 12c10-14 20 14 30 0s20-14 30 0 20 14 30 0 20-14 27-1" stroke="var(--coral)" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>{" "}
          yang enak dipakai.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
          Kami merancang dan membangun website, web application, serta dashboard yang terasa hidup,
          mudah dikelola, dan nyaman di semua layar.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ToyButton href="/contact" size="lg">
            Ceritain Ide Kamu <Sparkle className="h-4 w-4" />
          </ToyButton>
          <ToyButton href="/work" variant="secondary" size="lg">
            Lihat Karya
          </ToyButton>
        </div>
      </div>
    </div>
  );
}