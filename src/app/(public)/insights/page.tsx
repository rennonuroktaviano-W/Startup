import { BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/motion/reveal";

export const metadata = buildMetadata({
  title: "Insights",
  description:
    "Artikel dan tips seputar website, web app, dan digital marketing dari KotakIde Studio. Konten sedang dipersiapkan — tanpa artikel palsu.",
});

export default function InsightsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="bg-grain absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-32 md:px-10 md:pt-40">
          <SectionHeader
            sticker="Insight"
            tone="purple"
            title={
              <>
                Catatan & tips seputar <span className="text-purple">digital</span>
              </>
            }
            subtitle="Artikel, studi singkat, dan pembaruan studio. Kami memilih menulis yang benar-benar berguna dibanding membanjiri halaman dengan artikel demi tampak ramai."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-10">
        <Reveal>
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            tone="purple"
            title="Insight pertama sedang dipersiapkan"
            description={`Kami lebih suka merilis tulisan saat benar-benar siap, termasuk yang berasal dari pembelajaran proyek nyata. Pantau terus lewat ${siteConfig.email} atau kunjungi halaman ini lagi.`}
          />
        </Reveal>
      </section>
    </>
  );
}