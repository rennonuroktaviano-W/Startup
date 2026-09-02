import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { ArticleProse } from "@/components/public/article-prose";
import { ToyButton } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi KotakIde Studio — bagaimana data pengunjung dan calon klien dikelola.",
});

export default function PrivacyPage() {
  return (
    <ArticleProse title="Kebijakan Privasi" updatedAt="1 September 2026">
      <h2>Ringkasan</h2>
      <p>
        {siteConfig.name} menghormati privasi kamu. Kami hanya mengumpulkan data yang diperlukan
        untuk menjalankan layanan ini dan menjawab pertanyaan atau project brief yang kamu kirim.
      </p>

      <h2>Data yang kami kumpulkan</h2>
      <p>Melalui formulir project brief, kami mengumpulkan:</p>
      <ul>
        <li>Nama dan nama bisnis/organisasi.</li>
        <li>Email dan nomor WhatsApp yang kamu berikan.</li>
        <li>Detail proyek yang kamu ceritakan (deskripsi, kebutuhan, referensi URL).</li>
        <li>Range budget dan target waktu yang kamu pilih.</li>
      </ul>
      <p>Kami tidak mengumpulkan data kartu kredit atau informasi pembayaran.</p>

      <h2>Bagaimana data digunakan</h2>
      <ul>
        <li>Menindaklanjuti project brief dan pertanyaan.</li>
        <li>Berkomunikasi melalui kanal yang kamu pilih.</li>
        <li>Menyusun penawaran kerja sama.</li>
      </ul>
      <p>Data tidak dijual dan tidak dibagikan ke pihak ketiga tanpa izin kecuali diwajibkan hukum.</p>

      <h2>Data analitik</h2>
      <p>
        Saat fitur analitik diaktifkan, kami hanya mengumpulkan data agregat (halaman, perangkat,
        durasi) tanpa informasi pribadi yang bisa mengidentifikasi kamu secara langsung.
      </p>

      <h2>Penyimpanan dan retensi</h2>
      <p>
        Data brief disimpan dalam sistem internal kami dan hanya diakses oleh tim. Data yang tidak
        lagi dibutuhkan akan dihapus. Kamu dapat meminta penghapusan atau ekspor data kapan saja
        melalui {siteConfig.email}.
      </p>

      <h2>Kontak</h2>
      <p>
        Pertanyaan tentang privasi dapat dikirim ke {siteConfig.email} atau via
        nomor WhatsApp yang tertera di situs ini.
      </p>
      <div className="mt-8">
        <ToyButton href="/contact">Hubungi kami</ToyButton>
      </div>
    </ArticleProse>
  );
}