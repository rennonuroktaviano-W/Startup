import { ArrowDown } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { detailedProcess } from "@/lib/content";
import { SectionHeader } from "@/components/public/section-header";
import { ToyButton } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Proses",
  description:
    "Alur kerja KotakIde Studio dari discovery sampai maintenance: jelas apa input kamu, apa yang kami kerjakan, output apa yang kamu terima, dan kapan kamu menyetujui.",
});

export default function ProcessPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-32 md:px-10 md:pt-40">
          <SectionHeader
            sticker="Proses"
            tone="mint"
            title={
              <>
                Alur yang bisa kamu <span className="text-mint">ikuti langkah demi langkah</span>
              </>
            }
            subtitle="Kami pecah pekerjaan menjadi tahapan kecil dengan checkpoint persetujuan. Begitu caranya, kamu selalu tahu posisi proyek dan kapan harus memberi keputusan."
          />
          <Reveal className="mt-8">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-2 text-sm font-semibold">
              <ArrowDown className="h-4 w-4 text-purple" /> Mulai dari tahap pertama
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-10">
        <ol>
          {detailedProcess.map((stage, i) => (
            <Reveal key={stage.name} delay={0}>
              <li className={cn("relative border-ink", i < detailedProcess.length - 1 && "pb-8")}>
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-base font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < detailedProcess.length - 1 && (
                      <span className="mt-2 w-0.5 grow border-l-2 border-dashed border-ink/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
                    <div className="flex flex-wrap items-baseline gap-x-3 justify-between">
                      <h2 className="font-display text-xl font-semibold text-ink">{stage.name}</h2>
                      <span className="text-sm font-semibold text-ink/50">{stage.estimation}</span>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Input dari kamu</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink/75">{stage.clientInput}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Aktivitas kami</p>
                        <ul className="mt-1 space-y-1 text-sm leading-relaxed text-ink/75">
                          {stage.activities.map((a) => (
                            <li key={a} className="flex items-start gap-1.5">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Output</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink/75">{stage.outputs}</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink/50">Checkpoint</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink/75">{stage.checkpoint}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-t-2 border-dashed border-ink/10 bg-white/40 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
          <p className="toy-sticker rotate-[-1deg] bg-sky">Tahap pertama itu yang paling menyenangkan</p>
          <h2 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Mari mulai dari Discovery.
          </h2>
          <p className="mt-3 text-ink/70">
            Isi project brief singkat, atau langsung sapa kami di WhatsApp. Tidak ada biaya, tidak ada komitmen.
          </p>
          <div className="mt-6">
            <ToyButton href="/contact" size="lg">
              Isi Project Brief
            </ToyButton>
          </div>
        </div>
      </section>
    </>
  );
}