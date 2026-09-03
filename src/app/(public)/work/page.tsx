import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { getPublishedProjects } from "@/lib/public-data";
import { SectionHeader } from "@/components/public/section-header";
import { WorkFilter } from "@/components/public/work-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { ToyButton } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Work",
  description:
    "Portofolio dan eksperimen KotakIde Studio. Sejauh ini berupa concept project internal — proyek klien menyusul dan akan ditampilkan di sini.",
});

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-32 md:px-10 md:pt-40">
          <SectionHeader
            sticker="Karya"
            tone="coral"
            title={
              <>
                Hasil kerja yang bisa <span className="text-coral">terlihat</span>, bukan janji
              </>
            }
            subtitle="Semua yang tampil di sini benar-benar kami kerjakan sendiri. Karya berlabel Concept/Internal Experiment adalah eksperimen studi — tidak kami samarkan sebagai proyek klien."
          />
          <Reveal className="mt-6">
            <p className="inline-block rounded-full border-2 border-ink bg-coral px-3 py-1 text-xs font-bold text-ink">
              KotakIde baru mulai — portofolio klien akan melengkapi halaman ini seiring proyek berjalan.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <Reveal>
          {projects.length > 0 ? (
            <WorkFilter projects={projects} />
          ) : (
            <EmptyState
              tone="coral"
              title="Belum ada karya yang diterbitkan"
              description="Concept project dan portofolio klien akan tampil di sini segera setelah diterbitkan dari panel admin."
            />
          )}
        </Reveal>
      </section>

      <section className="border-t-2 border-dashed border-ink/10 bg-white/40 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
          <p className="toy-sticker rotate-[-1deg] bg-purple text-white">Punya proyek pertama buat kami?</p>
          <h2 className="mt-5 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Jadilah bagian dari portofolio berikutnya.
          </h2>
          <p className="mt-3 text-ink/70">
            Kalau masalahmu menarik dan tim kami cocok, kami kerjakan dengan standar yang sama seperti eksperimen di atas — tapi untuk hasil aslimu. Hubungi kami lewat {siteConfig.email}.
          </p>
          <div className="mt-6">
            <ToyButton href="/contact" size="lg">
              Mulai Proyek
            </ToyButton>
          </div>
        </div>
      </section>
    </>
  );
}