import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { ToyButton } from "@/components/ui/button";
import { SectionHeader } from "@/components/public/section-header";
import { ServiceFilter } from "@/components/public/service-filter";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Website company profile, landing page, web application, dashboard & admin CMS, UI implementation/redesign, dan maintenance. Lihat layanan KotakIde Studio.",
});

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-32 md:px-10 md:pt-40">
          <SectionHeader
            sticker="Layanan"
            tone="sky"
            title={
              <>
                Bukan cuma membuat <span className="text-purple">website “jadi”</span>, tapi hasil yang membawa tujuanmu
              </>
            }
            subtitle="Semua pekerjaan kami diarahkan ke satu hal: membuat bisnismu lebih terlihat, lebih mudah dijangkau, dan lebih lancar beroperasi. Sesuaikan kebutuhanmu lewat filter di bawah."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <Reveal>
          <ServiceFilter />
        </Reveal>
      </section>

      <section className="relative overflow-hidden border-t-2 border-dashed border-ink/10 bg-white/40 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
          <p className="toy-sticker rotate-1 bg-lemon">Masih ragu pilih yang mana?</p>
          <h2 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Ceritakan masalahmu, kami sarankan solusinya.
          </h2>
          <p className="mt-3 text-ink/70">
            Tidak perlu paham istilah teknis. Konsultasi awal gratis dan tanpa komitmen — via WhatsApp atau {siteConfig.email}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ToyButton href="/contact" size="lg">
              Konsultasi Gratis
            </ToyButton>
          </div>
        </div>
      </section>
    </>
  );
}