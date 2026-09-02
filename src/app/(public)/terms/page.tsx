import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { ArticleProse } from "@/components/public/article-prose";
import { ToyButton } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan umum layanan KotakIde Studio.",
});

export default function TermsPage() {
  return (
    <ArticleProse title="Syarat & Ketentuan" updatedAt="1 September 2026">
      <h2>Ruang lingkup</h2>
      <p>
        Ketentuan ini mengatur penggunaan website dan layanan {siteConfig.name}. Dengan menghubungi
        kami, kamu dianggap memahami bahwa informasi yang kamu kirim digunakan untuk menindaklanjuti
        permintaanmu.
      </p>

      <h2>Proposal & kesepakatan proyek</h2>
      <p>
        Setiap proyek diatur oleh proposal tertulis yang disepakati kedua belah pihak. Proposal
        tersebut menjadi dokumen utama yang mengatur scope, biaya, jadwal, dan hak serta kewajiban.
        Ketentuan halaman ini tidak menggantikan isi proposal.
      </p>

      <h2>Konten milik klien</h2>
      <ul>
        <li>Kamu menjamin punya hak atas konten dan aset yang kamu serahkan.</li>
        <li>Pihak [NAMA PERUSAHAAN LEGAL] (placeholder, akan diperbarui dari CMS) tidak bertanggung jawab atas pelanggaran hak cipta konten yang diunggah klien.</li>
        <li>Konten yang melanggar hukum atau bertentangan dengan nilai kami dapat ditolak.</li>
      </ul>

      <h2>Revisi</h2>
      <p>
        Putaran revisi disepakati pada proposal. Revisi di luar kesepakatan dihitung sebagai
        pekerjaan tambahan dengan penawaran terpisah.
      </p>

      <h2>Hosting, domain, dan pihak ketiga</h2>
      <p>
        Biaya domain, hosting, dan layanan pihak ketiga lainnya bersifat terpisah dari biaya
        pembuatan, kecuali dinyatakan lain dalam proposal.
      </p>

      <h2>Tanggung jawab</h2>
      <p>
        Kami berusaha menjaga kualitas dan keamanan hasil kerja. Tanggung jawab dibatasi sesuai
        ketentuan yang berlaku di hukum Indonesia dan dirinci lebih lanjut pada proposal masing-masing
        proyek.
      </p>

      <h2>Kontak</h2>
      <p>
        Ada pertanyaan soal ketentuan ini? Hubungi kami lewat {siteConfig.email}.
      </p>
      <div className="mt-8">
        <ToyButton href="/contact">Hubungi kami</ToyButton>
      </div>
    </ArticleProse>
  );
}