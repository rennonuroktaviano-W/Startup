# PRD & Technical Blueprint
## Website Company Profile Startup Jasa Website & Application

**Versi dokumen:** 1.0  
**Tanggal:** 1 September 2026  
**Status:** Siap diberikan kepada AI coding agent  
**Nama sementara:** [NAMA STARTUP]  
**Bahasa utama:** Bahasa Indonesia  
**Target pasar awal:** UMKM, startup, personal brand, sekolah, organisasi, dan perusahaan kecil-menengah yang membutuhkan website atau aplikasi.

---

# 0. Cara Menggunakan Dokumen Ini

Dokumen ini adalah sumber kebenaran utama untuk desain, fitur, arsitektur, database, CMS, keamanan, dan standar kualitas proyek.

AI coding agent wajib:

1. Membaca seluruh dokumen sebelum menulis kode.
2. Menganggap setiap requirement berlabel wajib sebagai acceptance criteria.
3. Membuat aplikasi full-stack yang benar-benar berjalan, bukan sekadar UI statis.
4. Menghubungkan seluruh konten yang dapat dikelola admin ke database.
5. Tidak membuat tombol palsu, menu mati, halaman kosong, data statistik palsu, logo klien palsu, atau testimoni palsu.
6. Tidak menggunakan lorem ipsum pada hasil akhir.
7. Tidak mengubah arah desain menjadi template SaaS generik.
8. Tidak menambahkan library berat tanpa alasan yang jelas.
9. Menjalankan lint, test, dan production build sebelum menyatakan proyek selesai.
10. Menyelesaikan error yang muncul; jangan meninggalkan TODO, FIXME, stub, atau mock API pada hasil akhir.
11. Menyediakan README, .env.example, migrasi database, seed yang aman, serta petunjuk instalasi.
12. Menggunakan satu package manager mengikuti lockfile yang sudah ada. Jika proyek dimulai dari nol, gunakan npm.

Apabila informasi brand belum tersedia, gunakan placeholder terpusat yang dapat diganti melalui CMS. Jangan menyebarkan hard-coded nama perusahaan, nomor WhatsApp, email, warna, dan alamat ke banyak file.

---

# 1. Keputusan Produk yang Sudah Dikunci

| Bagian | Keputusan |
|---|---|
| Jenis produk | Website company profile sekaligus alat penerimaan calon klien |
| Framework | Next.js App Router |
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Next.js Server Functions/Server Actions dan Route Handlers sesuai kebutuhan |
| Database | MySQL |
| ORM | Prisma ORM |
| Authentication | Login admin aman berbasis session |
| CMS | Custom admin CMS, bukan CMS pihak ketiga |
| Desain publik | Fun, penuh warna, playful, unik, tetapi tetap dipercaya sebagai studio teknologi |
| Navigasi publik | Tanpa navbar full-width tradisional |
| Footer publik | Tanpa footer tradisional |
| Pengganti navigasi | Floating glass controls/dock dengan blur dan opacity rendah |
| Responsivitas | Mobile-first dan harus nyaman di seluruh ukuran perangkat |
| Animasi | CSS/React motion sebagai dasar; 3D hanya sebagai progressive enhancement |
| Bahasa | Indonesia sebagai default; struktur siap ditambah English di masa depan |
| Data palsu | Dilarang; section yang belum memiliki data harus disembunyikan atau diberi empty state yang jujur |

Catatan penting: larangan navbar dan footer berlaku untuk website publik. Admin CMS tetap menggunakan sidebar/topbar yang praktis agar pekerjaan admin tidak terganggu oleh eksperimen visual.

---

# 2. Ringkasan Produk

[NAMA STARTUP] adalah studio digital baru yang menjual jasa:

- Company profile website.
- Landing page.
- Website bisnis dan katalog.
- Web application.
- Dashboard dan admin CMS.
- Sistem internal sederhana.
- UI implementation dan redesign.
- Maintenance, optimasi, dan dukungan setelah peluncuran.

Website harus melakukan tiga pekerjaan utama:

1. Menjelaskan kemampuan startup secara cepat dan meyakinkan.
2. Menampilkan karakter brand yang fun, berani, kreatif, dan berbeda.
3. Mengubah pengunjung menjadi lead melalui formulir project brief, WhatsApp, atau email.

Website tidak boleh terasa seperti playground tanpa tujuan. Setiap animasi dan dekorasi harus membantu storytelling, menunjukkan kemampuan teknis, mengarahkan perhatian, atau memberi feedback terhadap interaksi.

---

# 3. Visi dan Sasaran

## 3.1 Visi

Menciptakan company profile yang terasa seperti sebuah digital playground: ceria dan penuh kejutan kecil, tetapi tetap cepat, mudah dipahami, dapat diakses, serta memiliki jalur konversi yang jelas.

## 3.2 Sasaran Bisnis

- Meningkatkan jumlah calon klien yang mengirim project brief.
- Membuat startup terlihat memiliki identitas sendiri walaupun baru dimulai.
- Memudahkan pemilik mengubah isi website tanpa membuka source code.
- Menjadi portofolio nyata dari kemampuan desain dan development startup.
- Menyediakan mini CRM agar inquiry tidak tercecer di chat pribadi.

## 3.3 Sasaran Pengguna

Pengunjung harus dapat memahami hal berikut dalam maksimal 60 detik:

- Perusahaan ini menawarkan jasa apa.
- Siapa yang cocok menggunakan jasanya.
- Bagaimana proses kerja dilakukan.
- Seperti apa kualitas atau gaya hasil kerjanya.
- Bagaimana memulai konsultasi.

## 3.4 Indikator Keberhasilan

Target berikut adalah sasaran awal, bukan angka palsu yang ditampilkan kepada publik:

- Persentase klik CTA utama dapat dilacak.
- Form project brief dapat diselesaikan tanpa error.
- Seluruh lead masuk ke CMS dan memicu notifikasi.
- Halaman publik lulus pemeriksaan responsif dari 320 px sampai layar desktop besar.
- Tidak ada horizontal overflow.
- Production build berhasil.
- Tidak ada error console pada alur utama.
- Target Core Web Vitals: LCP maksimal 2,5 detik, CLS maksimal 0,1, dan INP maksimal 200 ms pada kondisi produksi yang wajar.

---

# 4. Pengguna dan Persona

## 4.1 Pemilik UMKM

Kebutuhan:

- Website yang membuat bisnis terlihat profesional.
- Penjelasan harga/proses yang tidak membingungkan.
- Cara konsultasi cepat melalui WhatsApp.

Perilaku:

- Mayoritas membuka melalui ponsel.
- Tidak selalu memahami istilah teknis.
- Membutuhkan bukti proses kerja dan contoh hasil.

## 4.2 Founder Startup atau Personal Brand

Kebutuhan:

- Landing page cepat untuk validasi.
- Web application atau dashboard.
- Tampilan yang tidak generik.
- Partner yang bisa menjelaskan solusi dengan bahasa sederhana.

## 4.3 Perusahaan atau Organisasi

Kebutuhan:

- Kredibilitas.
- Scope pekerjaan jelas.
- Keamanan, timeline, dan dukungan setelah launch.
- Jalur kontak formal.

## 4.4 Admin Internal

Kebutuhan:

- Mengedit website tanpa menyentuh kode.
- Melihat dan menindaklanjuti lead.
- Mengelola portofolio, layanan, artikel, SEO, media, dan akun staf.
- Mengetahui perubahan penting melalui audit log.

---

# 5. Ruang Lingkup

## 5.1 Termasuk dalam Versi Pertama

- Website publik multi-page.
- Floating navigation tanpa navbar tradisional.
- Home, services, work, detail project, about, process, insight/blog, detail artikel, dan contact/project brief.
- Search dan filter sederhana untuk work dan insight.
- Form project brief multi-step.
- Integrasi WhatsApp dan email.
- Admin CMS lengkap.
- Mini CRM untuk inquiry.
- Role-based access control.
- Media library.
- Draft, preview, publish, schedule, archive, dan revision history untuk konten utama.
- SEO teknis dan SEO per konten.
- Sitemap, robots, Open Graph, dan structured data.
- MySQL, migrasi, seed, dan backup/export dasar.
- Analytics event abstraction.
- Responsive layout.
- Reduced-motion mode.
- Testing dan dokumentasi.

## 5.2 Tidak Termasuk dalam Versi Pertama

- Aplikasi mobile native.
- Marketplace multi-vendor.
- Payment gateway.
- Client portal untuk melihat progres proyek.
- Sistem akuntansi lengkap.
- Chat real-time.
- AI chatbot.
- Multi-tenant CMS.
- Sistem project management besar seperti Jira.

Fitur di luar scope tidak boleh ditambahkan sebelum seluruh requirement versi pertama selesai dan stabil.

---

# 6. Arah Brand dan Art Direction

## 6.1 Konsep Utama

**Creative Toybox Meets Digital Product Studio**

Nuansa yang dicari:

- Fun seperti energi dunia anak-anak.
- Penuh warna tetapi tidak norak.
- Bentuk visual terasa handcrafted.
- Sedikit nakal, percaya diri, dan penuh rasa ingin tahu.
- Tetap rapi dan kompeten saat menjelaskan jasa.

Rasio karakter:

- 70% playful.
- 30% professional.

Hindari kesan:

- Website sekolah TK.
- Game anak-anak.
- Template SaaS futuristik generik.
- Kumpulan efek tanpa arah.
- Tema hacker/cyber neon yang tidak relevan.

## 6.2 Palet Warna Awal

Semua warna wajib menjadi design token dan dapat disesuaikan melalui CMS atau konfigurasi tema.

| Token | Warna awal | Fungsi |
|---|---|---|
| Ink | #17132B | Teks utama dan outline |
| Paper | #FFF9F3 | Background utama |
| Purple Pop | #7357FF | Aksen utama dan CTA |
| Lemon | #FFD84D | Highlight ceria |
| Coral | #FF6B72 | Aksen hangat |
| Sky | #62D8FF | Aksen teknologi |
| Mint | #66E2A6 | Status positif |
| White | #FFFFFF | Surface |
| Danger | #D9364F | Error dan destructive action |

Aturan warna:

- Teks panjang selalu memakai Ink atau warna gelap dengan kontras cukup.
- Warna cerah digunakan sebagai bidang, ikon, sticker, dan highlight; bukan untuk semua teks.
- Maksimal tiga warna dominan tampak bersamaan dalam satu viewport.
- Jangan menggunakan rainbow gradient besar pada setiap section.
- Gradient hanya boleh dipakai sebagai detail kecil dan memiliki alasan visual.

## 6.3 Tipografi

- Display: Fredoka, Baloo 2, atau font display rounded setara.
- Body/UI: Plus Jakarta Sans, Manrope, atau font sans yang sangat terbaca.
- Gunakan next/font agar pemuatan font teroptimasi.
- Maksimal dua keluarga font.
- Heading boleh ekspresif tetapi body text harus tenang.
- Jangan membuat seluruh heading uppercase.
- Ukuran body minimum 16 px pada mobile.

## 6.4 Shape Language

Gunakan:

- Browser cards.
- Cursor characters.
- UI tiles.
- Squiggles.
- Stars dan burst shapes secukupnya.
- Clay-like geometric blocks.
- Sticker labels.
- Bentuk potongan kertas.
- Garis outline 1,5–2 px.
- Shadow berlapis yang terasa seperti objek fisik.
- Texture grain/noise sangat tipis, maksimal sekitar 3–4% opacity.

Dekorasi harus berasal dari dunia pembuatan produk digital: browser, layout grid, cursor, device, window, button, color swatch, component block, dan code tile.

## 6.5 Aturan Anti “AI Slop”

AI coding agent dilarang:

- Membuat hero generik dengan badge “Innovate. Transform. Grow.”
- Menggunakan tulisan “revolutionizing the digital landscape.”
- Mengisi halaman dengan random gradient blob.
- Memakai glassmorphism pada seluruh card.
- Membuat bento grid hanya karena sedang tren.
- Menambahkan sparkles di semua tempat.
- Menggunakan stock illustration bergaya AI tanpa kesesuaian brand.
- Membuat logo klien, angka proyek, rating, atau testimoni fiktif.
- Mengulang animasi fade-up yang sama pada semua elemen.
- Membuat headline besar tetapi menyisakan ruang kosong tanpa fungsi.
- Membuat marquee teks yang tidak membantu pemahaman.
- Menggunakan icon dengan gaya yang saling bertabrakan.
- Mengorbankan keterbacaan demi opacity rendah.

Setiap section wajib memiliki:

- Satu tujuan komunikasi.
- Satu hierarki visual yang jelas.
- Maksimal satu interaksi utama.
- Dekorasi yang relevan dengan isi.

---

# 7. Sistem Navigasi Tanpa Navbar dan Footer Tradisional

## 7.1 Desktop

Tidak ada navbar full-width.

Gunakan tiga floating controls:

1. **Brand Pebble** di kiri atas:
   - Logo mark dan nama singkat.
   - Background rgba putih gelap/terang sesuai section.
   - Backdrop blur 14–20 px.
   - Opacity visual rendah tetapi teks/logo tetap memiliki kontras yang aman.
   - Klik kembali ke Home.

2. **Menu Orb** di kanan atas:
   - Tombol bulat atau rounded-square.
   - Membuka menu overlay seperti papan main.
   - Overlay menampilkan Home, Services, Work, About, Insight, dan Contact.
   - Setiap item memiliki nomor, warna, dan micro-animation unik yang tetap konsisten.
   - ESC menutup overlay.
   - Focus trap wajib bekerja.

3. **Project CTA Bubble** di kanan bawah:
   - Label pendek seperti “Mulai proyek”.
   - Tidak menutupi konten atau cookie notice.
   - Hilang atau mengecil saat closing CTA sudah terlihat.

## 7.2 Mobile

- Gunakan floating bottom glass dock.
- Maksimal empat item langsung terlihat: Home, Services, Work, Contact.
- Item lain berada di tombol More yang membuka bottom sheet.
- Dock mempertimbangkan safe-area iPhone.
- Tinggi target sentuh minimal 44 px.
- Saat keyboard terbuka, dock tidak boleh menutupi input.
- Pada halaman form, dock dapat berubah menjadi compact mode.

## 7.3 Pengganti Footer

Tidak ada blok footer tradisional berisi banyak kolom.

Gunakan **Closing Playground** sebagai section terakhir:

- CTA utama.
- Email dan WhatsApp.
- Social links.
- Legal micro-links: Privacy dan Terms.
- Copyright.
- Semua berada dalam komposisi visual, bukan footer template.
- Legal micro-links tetap dapat diakses tanpa menyembunyikannya di opacity terlalu rendah.

---

# 8. Motion dan Interaction System

## 8.1 Prinsip

- Animasi harus memberi orientasi, feedback, atau karakter.
- Jangan menunda pengguna demi animasi.
- Loading screen hanya muncul saat benar-benar ada proses loading.
- Jangan menambahkan timeout palsu.
- Semua interaksi utama tetap dapat digunakan tanpa JavaScript animasi.

## 8.2 Hero 3D: “Toy Website Factory”

Hero menampilkan satu dunia mini:

- Browser window sebagai objek pusat.
- Color swatches, cursor, button, card, dan device block mengorbit perlahan.
- Pointer desktop mengubah perspektif maksimal beberapa derajat.
- Objek dapat bereaksi lembut ketika CTA di-hover.
- Satu objek kecil dapat di-drag, tetapi tidak mengganggu scroll.
- Scene tidak boleh membuat teks sulit dibaca.

Progressive enhancement:

- Base: SVG dan CSS 3D yang ringan.
- Desktop capable device: WebGL/React Three Fiber boleh digunakan bila performance budget tetap tercapai.
- Mobile: kurangi jumlah objek, matikan drag, dan gunakan gerakan ringan.
- Low-end, save-data, atau reduced-motion: tampilkan ilustrasi statis.
- Scene 3D di-load secara dinamis dan tidak masuk critical rendering path.

## 8.3 Micro-Interactions

- Button utama memiliki squash-and-release 150–220 ms.
- Card service sedikit tilt hanya pada pointer fine.
- Filter project memakai animated layout transition.
- Menu overlay muncul seperti lembar/sticker yang dibuka.
- Status sukses form memunculkan confetti kecil satu kali; tidak berulang.
- Link eksternal memberi indikator yang jelas.
- Input memberi feedback focus, valid, dan invalid.
- Route transition singkat maksimal sekitar 350 ms.

## 8.4 Custom Cursor

Opsional dan hanya desktop:

- Aktif hanya pada pointer fine.
- Tidak mengganti cursor di input, textarea, editor, atau elemen native penting.
- Dinonaktifkan pada reduced-motion.
- Dilarang bila menurunkan frame rate atau aksesibilitas.

## 8.5 Reduced Motion

Saat prefers-reduced-motion aktif:

- Matikan parallax, tilt, orbit, drag physics, marquee, dan route transition besar.
- Gunakan perubahan opacity sederhana dengan durasi minimal.
- Konten tidak boleh hilang atau bergantung pada animasi.

---

# 9. Information Architecture dan Route Publik

| Route | Nama | Tujuan |
|---|---|---|
| / | Home | Menjelaskan value, jasa, karya, proses, dan CTA |
| /services | Services | Daftar dan detail ringkas semua layanan |
| /services/[slug] | Service Detail | Menjelaskan deliverables, proses, FAQ, dan CTA |
| /work | Work | Daftar portofolio dan concept project |
| /work/[slug] | Case Study | Menjelaskan masalah, solusi, proses, dan hasil |
| /about | About | Cerita studio, prinsip, dan tim |
| /process | Process | Alur kerja dari discovery hingga launch |
| /insights | Insights | Artikel, tips, dan berita studio |
| /insights/[slug] | Article | Detail artikel |
| /contact | Project Brief | Form inquiry multi-step |
| /privacy | Privacy | Kebijakan privasi |
| /terms | Terms | Syarat layanan umum |
| /preview/[token] | Preview | Preview privat draft dari CMS |
| /sitemap.xml | Sitemap | SEO |
| /robots.txt | Robots | SEO |

Route yang tidak memiliki konten valid harus menampilkan 404 yang dirancang dengan gaya brand, bukan error default.

---

# 10. Spesifikasi Halaman Home

## 10.1 Hero

Tujuan: menjelaskan layanan dalam satu pandangan.

Konten:

- Eyebrow pendek, misalnya “Studio web kecil dengan ide besar.”
- Headline awal: “Dari ide kecil jadi produk digital yang enak dipakai.”
- Subheadline yang menyebut website, application, dan support.
- CTA utama: “Ceritain Ide Kamu.”
- CTA kedua: “Lihat Karya.”
- Hero 3D Toy Website Factory.
- Indikator scroll yang tidak berlebihan.

Headline, subheadline, CTA, dan visual variant harus dapat diedit melalui CMS.

## 10.2 Service Playground

Tampilkan layanan sebagai objek berbeda di sebuah meja digital:

- Company Profile.
- Landing Page.
- Web Application.
- Dashboard & Admin CMS.
- UI Implementation/Redesign.
- Maintenance & Optimization.

Setiap card:

- Ikon/ilustrasi konsisten.
- Judul.
- Penjelasan satu atau dua kalimat.
- Cocok untuk siapa.
- Link detail.
- Warna aksen berbeda tetapi terkontrol.

## 10.3 “Masalah Berantakan Jadi Produk Rapi”

Gunakan interactive before/after browser:

- Before menunjukkan informasi yang tercecer.
- After menunjukkan struktur website/app yang jelas.
- Slider harus keyboard accessible.
- Pada mobile, gunakan toggle Before/After bila slider sulit dipakai.

## 10.4 Selected Work

- Menampilkan 3–6 karya berstatus featured.
- Card memiliki cover, kategori, tahun, layanan, dan ringkasan.
- Hover memperlihatkan potongan UI secara ringan.
- Project detail terbuka melalui route sendiri.
- Jika belum ada client project, tampilkan “Playground Experiments” yang jelas diberi label Concept/Internal Experiment.
- Jangan menyamarkan concept project sebagai proyek klien.

## 10.5 Process

Empat fase:

1. Ngobrol — discovery dan memahami tujuan.
2. Rancang — scope, struktur, dan visual.
3. Bangun — development, CMS, dan testing.
4. Luncur — deploy, training, dan support.

Tampilkan sebagai jalur mainan/interaktif yang berubah bentuk ketika discroll, tetapi teks tetap statis dan terbaca.

## 10.6 Principles

Tiga sampai lima prinsip:

- Jelas sebelum ramai.
- Fun tanpa mengganggu fungsi.
- Mobile bukan versi sisa.
- Konten mudah dikelola.
- Tidak berhenti saat website online.

## 10.7 Metrics

- Section ini default-nya hidden.
- Hanya tampil bila admin memasukkan data nyata.
- Setiap angka wajib memiliki label dan opsional sumber/periode.
- Dilarang seed angka proyek, kepuasan, atau klien palsu.

## 10.8 Testimonials

- Hanya testimonial published yang tampil.
- Nama, jabatan, perusahaan, kutipan, avatar/logo opsional, dan izin publikasi.
- Jika kosong, seluruh section disembunyikan.

## 10.9 Insight Preview

- Maksimal tiga artikel terbaru/featured.
- Menampilkan thumbnail, kategori, waktu baca, tanggal, dan judul.

## 10.10 FAQ

- Pertanyaan awal:
  - Berapa lama membuat website?
  - Apakah website bisa diedit sendiri?
  - Apakah sudah responsive?
  - Apakah termasuk domain dan hosting?
  - Bagaimana proses revisi?
  - Apakah menerima maintenance?
- Semua data dari CMS.
- Accordion accessible dan dapat dibuka dengan keyboard.

## 10.11 Closing Playground

- Copy CTA kuat tetapi tidak agresif.
- Tombol “Isi Project Brief.”
- Tombol WhatsApp.
- Email, social links, legal links, dan copyright.
- Dekorasi merespons CTA secara ringan.

---

# 11. Halaman Services

## 11.1 Daftar Services

Fitur:

- Hero ringkas.
- Filter berdasarkan tujuan: Branding, Selling, Operations, Custom App.
- Card services.
- Perbandingan outcome, bukan sekadar daftar teknologi.
- CTA konsultasi.

## 11.2 Detail Service

Setiap service memiliki:

- Nama.
- Slug.
- Short description.
- Long description.
- Target client.
- Problems solved.
- Deliverables.
- Process khusus.
- Estimasi waktu berupa range, bukan janji mutlak.
- Starting price opsional.
- Status “harga berdasarkan scope” bila harga disembunyikan.
- Related work.
- FAQ service.
- CTA project brief yang otomatis mengisi jenis layanan.
- SEO fields.

Harga dan timeline dapat disembunyikan per layanan melalui CMS.

---

# 12. Work dan Case Study

## 12.1 Work Listing

Fitur:

- Search.
- Filter berdasarkan service, industry, dan status Client/Concept.
- Sorting newest/featured.
- Pagination atau load more yang accessible.
- Empty state yang jelas.

## 12.2 Case Study Detail

Struktur:

1. Project cover.
2. Project facts: client atau label concept, tahun, industry, services.
3. Challenge.
4. Goals.
5. Approach.
6. Design/development highlights.
7. Gallery.
8. Outcome.
9. Metrics nyata bila tersedia.
10. Client testimonial bila tersedia.
11. Related project.
12. CTA.

Aturan:

- Jangan membuat metrik palsu.
- Bila project merupakan concept project, label harus terlihat di hero dan metadata.
- Gallery mendukung portrait, landscape, device mockup, dan video pendek tanpa autoplay bersuara.
- Semua gambar memiliki alt text.

---

# 13. About dan Process

## 13.1 About

- Cerita mengapa studio dibuat.
- Value dan cara berpikir.
- Keunggulan startup kecil: komunikasi dekat, fleksibel, dan fokus.
- Team members dari CMS.
- Tool/tech stack opsional.
- Timeline perjalanan hanya bila ada data nyata.
- CTA.

Hindari klaim “leading agency” atau “award-winning” jika belum terbukti.

## 13.2 Process

- Discovery.
- Proposal dan scope.
- Content collection.
- Wireframe.
- Visual design.
- Development.
- Testing.
- Launch.
- Handover/training.
- Maintenance.

Setiap tahap berisi:

- Input dari klien.
- Aktivitas studio.
- Output.
- Estimasi waktu.
- Approval checkpoint.

---

# 14. Insights/Blog

Fitur:

- List artikel.
- Search.
- Category dan tag.
- Featured article.
- Draft, scheduled, published, archived.
- Reading time otomatis.
- Table of contents otomatis untuk artikel panjang.
- Share links.
- Related posts.
- Author.
- SEO fields.
- RSS opsional.

Editor CMS:

- Rich text berbasis block atau structured JSON.
- Heading, paragraph, quote, list, image, video embed allowlist, code block, callout, dan CTA.
- Paste dari Google Docs harus dibersihkan.
- HTML harus disanitasi.

---

# 15. Contact dan Project Brief

## 15.1 Tujuan

Mengumpulkan informasi cukup untuk konsultasi pertama tanpa membuat pengguna lelah.

## 15.2 Form Multi-Step

### Step 1 — Tentang Anda

- Nama.
- Nama bisnis/organisasi.
- Email.
- Nomor WhatsApp.
- Pilihan metode komunikasi.

### Step 2 — Proyek

- Jenis layanan.
- Tujuan utama.
- Deskripsi singkat.
- Apakah sudah memiliki desain, domain, hosting, atau konten.

### Step 3 — Scope

- Fitur yang dibutuhkan.
- Referensi URL opsional.
- Lampiran opsional.
- Target deadline.

### Step 4 — Budget dan Konfirmasi

- Range budget yang dapat diatur melalui CMS, contoh:
  - Di bawah Rp5 juta.
  - Rp5–10 juta.
  - Rp10–25 juta.
  - Di atas Rp25 juta.
  - Belum tahu, butuh konsultasi.
- Ringkasan jawaban.
- Persetujuan privasi.
- Submit.

## 15.3 UX Form

- Progress indicator.
- Data tidak hilang saat berpindah step.
- Validasi per step dan validasi ulang di server.
- Error ditampilkan dekat field.
- Focus diarahkan ke error pertama.
- Tombol submit memiliki state idle, loading, success, dan error.
- Cegah double-submit.
- Simpan draft lokal opsional tanpa data sensitif berlebihan.
- Setelah sukses, tampilkan nomor inquiry dan perkiraan waktu respons yang dapat diatur admin.
- Kirim acknowledgment email ke calon klien.
- Kirim notifikasi ke admin.

## 15.4 Anti-Spam

- Honeypot.
- Rate limiting.
- Minimum form completion time.
- CAPTCHA/Turnstile hanya bila dibutuhkan atau aktivitas mencurigakan.
- Validasi server untuk semua field.

---

# 16. Admin CMS

## 16.1 Prinsip Admin

- Admin mengutamakan kejelasan dan kecepatan, bukan animasi berlebihan.
- Desktop menggunakan collapsible sidebar dan topbar.
- Mobile menggunakan compact header serta drawer.
- Semua tabel memiliki alternatif card pada layar kecil.
- Setiap aksi mutation memiliki loading, success, error, dan retry state.
- Aksi destructive wajib meminta konfirmasi.

## 16.2 Route Admin

| Route | Modul |
|---|---|
| /admin/login | Login |
| /admin | Dashboard |
| /admin/pages | Pages dan section builder |
| /admin/services | Services |
| /admin/projects | Portfolio/case studies |
| /admin/testimonials | Testimonials |
| /admin/clients | Client identities |
| /admin/team | Team |
| /admin/blog | Posts |
| /admin/blog/categories | Categories |
| /admin/blog/tags | Tags |
| /admin/faqs | FAQ |
| /admin/leads | Inquiry/mini CRM |
| /admin/media | Media library |
| /admin/navigation | Floating navigation |
| /admin/seo | Global SEO dan redirects |
| /admin/theme | Warna, dekorasi, dan motion controls |
| /admin/settings | Site, contact, social, email |
| /admin/users | User dan role |
| /admin/audit-logs | Audit log |
| /admin/backups | Export dan backup controls |

## 16.3 Dashboard

Widget:

- New inquiries.
- Unread inquiries.
- Qualified leads.
- Won/lost leads.
- Published projects.
- Draft content.
- Scheduled posts.
- Storage usage.
- Recent activity.
- Top CTA events bila analytics tersedia.

Fitur:

- Filter date range.
- Quick actions.
- Greeting tidak perlu berlebihan.
- Data kosong memiliki empty state yang menjelaskan langkah berikut.

## 16.4 Page and Section Builder

Admin dapat:

- Membuat halaman.
- Mengubah slug.
- Mengatur status draft/published/archived.
- Menyusun ulang section dengan drag-and-drop dan tombol keyboard-friendly.
- Menyalakan/mematikan section.
- Memilih variant yang sudah dibuat developer.
- Mengedit copy, CTA, warna aksen, media, dan alignment.
- Preview desktop/tablet/mobile.
- Menyimpan draft.
- Preview melalui secure token.
- Menjadwalkan publish.
- Melihat revision history.
- Restore revision.

Larangan:

- Jangan membuat page builder bebas seperti Canva.
- Gunakan curated section variants agar desain tetap konsisten.
- Admin tidak boleh memasukkan arbitrary JavaScript.

## 16.5 Services Manager

- CRUD.
- Reorder.
- Draft/publish/archive.
- Featured toggle.
- Deliverables repeatable fields.
- Service FAQ.
- Related projects.
- Harga/timeline visibility.
- SEO.

## 16.6 Project Manager

- CRUD.
- Client project atau concept project.
- Featured toggle.
- Industry dan service relation.
- Cover dan gallery ordering.
- Project facts.
- Challenge, approach, outcome.
- Metrics repeatable.
- Testimonial relation.
- Draft/preview/publish/schedule/archive.
- SEO.

## 16.7 Testimonial and Client Manager

- CRUD.
- Status pending permission/published/hidden.
- Consent/publication note.
- Relation ke client dan project.
- Reorder.
- Avatar/logo optional.
- Tidak boleh published tanpa nama/keterangan minimum yang valid.

## 16.8 Blog Manager

- Rich text/block editor.
- Auto-save draft.
- Manual save.
- Category/tag.
- Featured image dan alt text.
- Author.
- Slug.
- Reading time.
- Preview.
- Schedule.
- Revision history.
- SEO.

## 16.9 FAQ Manager

- CRUD.
- Category: General, Service, Process, Pricing.
- Reorder.
- Visibility per page/service.

## 16.10 Lead/Inquiry Mini CRM

Status pipeline:

1. NEW.
2. CONTACTED.
3. QUALIFIED.
4. PROPOSAL_SENT.
5. WON.
6. LOST.
7. SPAM.

Fitur:

- Table dan Kanban view.
- Search dan advanced filter.
- Filter service, budget, status, assignee, dan date.
- Detail lengkap jawaban form.
- Internal notes.
- Activity timeline.
- Assign ke staf.
- Ubah status.
- Tandai unread/read.
- Direct WhatsApp dan email action.
- Copy contact.
- Download attachment melalui authenticated URL.
- Export CSV.
- Bulk status update.
- Archive/soft delete.
- Restore.
- Spam marking.
- Simpan lost reason.
- Dashboard conversion summary.

Jangan membuat fitur yang otomatis mengirim proposal atau pesan status tanpa tindakan eksplisit admin.

## 16.11 Media Library

- Upload drag-and-drop.
- List dan grid view.
- Search.
- Filter type/date/uploader.
- Alt text wajib untuk media yang dipakai di publik.
- Caption dan credit.
- Focal point/crop metadata.
- Copy URL bila memang publik.
- Dependency check sebelum delete.
- Replace asset tanpa merusak relasi.
- Image dimensions dan file size terlihat.
- Optimization status.
- Bulk delete hanya untuk asset yang tidak digunakan.

## 16.12 Navigation Manager

- Edit label.
- Edit route.
- Reorder.
- Visibility.
- External/internal type.
- CTA flag.
- Icon selection dari curated icon set.
- Mobile dock limit validation.

## 16.13 Theme and Motion Manager

Admin boleh:

- Mengubah design tokens warna.
- Memilih hero visual variant yang sudah tersedia.
- Mengatur intensity: Calm, Playful, Extra.
- Mengaktifkan/nonaktifkan optional decoration.
- Mengatur background texture.

Admin tidak boleh:

- Menulis arbitrary CSS.
- Menulis JavaScript.
- Mengubah motion sampai melanggar reduced-motion atau performance guard.

## 16.14 SEO Manager

- Default title template.
- Default description.
- Canonical base URL.
- Default Open Graph image.
- Index/noindex.
- Per-page override.
- Redirect 301/302.
- Social handles.
- Organization schema data.
- Sitemap inclusion.
- Slug collision validation.
- Broken internal link report dasar.

## 16.15 Settings

Kelompok:

- Brand identity.
- Legal company name.
- Logo, mark, favicon.
- Tagline dan description.
- Email, WhatsApp, phone.
- Address dan map URL.
- Business hours.
- Social links.
- Locale, timezone, currency.
- Response-time text.
- Form budget options.
- Email notification recipients.
- Maintenance mode.
- Cookie/analytics configuration.

## 16.16 User and Role Manager

- Invite/create admin.
- Activate/deactivate account.
- Assign role.
- Reset password melalui alur aman.
- Force logout sessions.
- Last login info.
- Tidak ada public admin registration.
- Super Admin terakhir tidak boleh dihapus atau diturunkan rolenya tanpa pengganti.

## 16.17 Audit Log

Catat:

- Login berhasil/gagal secara wajar tanpa menyimpan password.
- Create/update/delete/restore/publish.
- Perubahan role.
- Perubahan settings.
- Export lead.
- Download attachment sensitif.

Field:

- Actor.
- Action.
- Entity type dan ID.
- Ringkasan perubahan.
- Timestamp.
- IP yang diperlakukan sesuai privacy policy.
- User agent ringkas.

---

# 17. Role dan Permission

| Kemampuan | Super Admin | Content Editor | Sales |
|---|---:|---:|---:|
| Dashboard | Ya | Ya | Ya |
| Kelola page/service/project | Ya | Ya | Lihat |
| Publish konten | Ya | Opsional sesuai permission | Tidak |
| Kelola blog/FAQ | Ya | Ya | Tidak |
| Kelola lead | Ya | Lihat terbatas | Ya |
| Export lead | Ya | Tidak | Jika diberi izin |
| Kelola media | Ya | Ya | Upload lampiran internal opsional |
| Kelola settings/theme/SEO | Ya | Terbatas | Tidak |
| Kelola user/role | Ya | Tidak | Tidak |
| Lihat audit log | Ya | Tidak | Tidak |
| Backup/export sistem | Ya | Tidak | Tidak |

Permission harus diperiksa di server. Menyembunyikan tombol di frontend tidak cukup.

---

# 18. Model Data

Gunakan UUID/CUID yang konsisten atau numeric ID sesuai keputusan agent, tetapi jangan mencampur strategi tanpa alasan. Semua tabel utama memiliki createdAt dan updatedAt. Konten serta inquiry penting menggunakan soft delete melalui deletedAt.

## 18.1 Entitas Utama

| Entitas | Field penting |
|---|---|
| User | id, name, email unique, passwordHash/auth fields, role, status, lastLoginAt, createdAt, updatedAt |
| SiteSetting | key unique, valueJson, group, isPublic, updatedBy |
| Page | id, title, slug unique, pageType, status, publishedAt, scheduledAt, seo fields, createdBy, updatedBy |
| PageSection | id, pageId, sectionType, variant, contentJson, styleJson allowlist, sortOrder, isVisible |
| ContentRevision | id, entityType, entityId, snapshotJson, versionNumber, createdBy, createdAt |
| Service | id, name, slug, shortDescription, bodyJson, targetClient, priceMode, startingPrice, timelineText, status, isFeatured, sortOrder, seo fields |
| ServiceDeliverable | id, serviceId, title, description, sortOrder |
| Project | id, title, slug, projectType, clientId nullable, industry, year, summary, challengeJson, approachJson, outcomeJson, coverMediaId, status, isFeatured, publishedAt, seo fields |
| ProjectService | projectId, serviceId |
| ProjectMedia | id, projectId, mediaId, layoutVariant, caption, sortOrder |
| ProjectMetric | id, projectId, label, value, unit, sourceNote, sortOrder |
| Client | id, name, logoMediaId, websiteUrl, isPublic, sortOrder |
| Testimonial | id, clientId nullable, projectId nullable, personName, jobTitle, companyName, quote, avatarMediaId, consentStatus, status, sortOrder |
| TeamMember | id, name, roleTitle, bio, photoMediaId, socialJson, status, sortOrder |
| BlogPost | id, title, slug, excerpt, bodyJson, featuredMediaId, authorId, status, scheduledAt, publishedAt, readingMinutes, seo fields |
| BlogCategory | id, name, slug, description |
| BlogTag | id, name, slug |
| PostCategory | postId, categoryId |
| PostTag | postId, tagId |
| FAQ | id, question, answerJson, category, serviceId nullable, pageId nullable, status, sortOrder |
| Inquiry | id, referenceNumber unique, name, companyName, email, whatsapp, preferredContact, serviceId nullable, projectType, goal, description, scopeJson, assetsStateJson, targetDate, budgetRange, consentAt, status, assigneeId nullable, lostReason, source, utmJson, lastContactedAt, deletedAt |
| InquiryNote | id, inquiryId, authorId, body, isPinned, createdAt |
| InquiryActivity | id, inquiryId, actorId nullable, action, metadataJson, createdAt |
| InquiryAttachment | id, inquiryId, mediaId/privateObjectKey, originalName, mimeType, sizeBytes |
| MediaAsset | id, fileName, originalName, mimeType, sizeBytes, width, height, storageKey, publicUrl nullable, altText, caption, credit, focalPointJson, uploadedBy, createdAt |
| NavigationItem | id, label, href, type, iconKey, isCta, isVisible, desktopOrder, mobileOrder |
| Redirect | id, sourcePath unique, destinationUrl, statusCode, isActive |
| NotificationSetting | id, eventKey, recipientsJson, channel, isEnabled |
| AuditLog | id, actorId nullable, action, entityType, entityId, summaryJson, ipHashOrMasked, userAgentSummary, createdAt |

## 18.2 SEO Fields

Konten yang memiliki route publik minimal menyimpan:

- metaTitle.
- metaDescription.
- canonicalUrl optional.
- ogMediaId optional.
- noIndex.
- structuredDataOverrideJson optional dan harus divalidasi.

## 18.3 Aturan Data

- Slug unique per content type.
- Email admin selalu unique dan normalized.
- Reference number inquiry dibuat server-side.
- Sort order tidak boleh menghasilkan duplikasi yang merusak tampilan.
- Delete client yang masih dipakai project/testimonial harus dicegah atau diubah menjadi soft delete.
- Media yang masih direferensikan tidak dapat dihapus permanen.
- Project type hanya CLIENT atau CONCEPT.
- Publish harus gagal bila field wajib atau SEO minimum belum lengkap.
- Semua monetary value disimpan sebagai integer unit mata uang terkecil atau integer Rupiah, bukan float.

---

# 19. Arsitektur Teknis

## 19.1 Pendekatan

- Server Components untuk data fetching publik dan admin yang tidak membutuhkan interaksi client.
- Client Components hanya untuk animasi, form interaktif, editor, drag-and-drop, chart, dan control yang membutuhkan browser state.
- Server Functions/Server Actions untuk mutation internal.
- Route Handlers untuk endpoint publik, webhook, upload flow, auth callbacks, dan integration boundary.
- Prisma sebagai akses database tunggal.
- Zod atau validation library setara untuk input validation.
- Repository/service layer digunakan pada domain yang kompleks seperti publishing, lead pipeline, media, dan audit.

## 19.2 Diagram Sederhana

~~~mermaid
flowchart TD
    V[Visitor] --> P[Next.js Public Site]
    A[Admin] --> C[Admin CMS]
    P --> S[Server Actions and Route Handlers]
    C --> S
    S --> D[(MySQL)]
    S --> X[Storage and Email]
~~~

## 19.3 Struktur Folder Rekomendasi

~~~text
src/
  app/
    (public)/
      page.tsx
      services/
      work/
      about/
      process/
      insights/
      contact/
      privacy/
      terms/
    admin/
      login/
      (protected)/
        dashboard/
        pages/
        services/
        projects/
        blog/
        leads/
        media/
        settings/
    api/
      inquiries/
      uploads/
      webhooks/
    layout.tsx
    loading.tsx
    error.tsx
    not-found.tsx
    sitemap.ts
    robots.ts
  actions/
    auth/
    content/
    inquiries/
    media/
    settings/
  components/
    public/
    admin/
    ui/
    motion/
    forms/
  features/
    auth/
    cms/
    inquiries/
    media/
    publishing/
    seo/
  lib/
    auth/
    db/
    validation/
    permissions/
    rate-limit/
    mail/
    storage/
    analytics/
    seo/
    utils/
  styles/
  types/
prisma/
  schema.prisma
  migrations/
  seed.ts
public/
  brand/
  illustrations/
  icons/
tests/
  unit/
  integration/
  e2e/
~~~

## 19.4 Component Rules

- Buat primitive UI reusable untuk button, input, select, dialog, drawer, table, badge, toast, tabs, pagination, uploader, empty state, dan skeleton.
- Public component dan admin component dipisahkan agar visual playful tidak bocor ke CMS.
- Hindari satu file component raksasa.
- Section public menerima typed data.
- Jangan fetch data yang sama berulang kali dari banyak child component.
- Jangan membuat semua component menjadi client component.
- Semua image publik memakai mekanisme optimasi Next.js atau pipeline setara.

---

# 20. Data Fetching, Mutation, dan Cache

- Halaman publik membaca published content saja.
- Draft hanya dapat diakses dengan admin session atau preview token berumur pendek.
- Setelah publish/update, lakukan cache invalidation/revalidation pada route terkait.
- Admin selalu melihat data terbaru.
- Form inquiry tidak di-cache.
- Semua mutation memiliki authorization dan validation di server.
- Mutation penting berjalan dalam database transaction.
- Duplicate submit inquiry dicegah dengan idempotency key atau fingerprint yang aman.
- Search dan filter admin dilakukan server-side saat dataset berkembang.

---

# 21. Authentication dan Security

## 21.1 Authentication

- Tidak ada register admin publik.
- Admin pertama dibuat dari seed aman atau command setup dengan credential dari environment.
- Password tidak boleh muncul di repository, seed publik, atau README.
- Password di-hash menggunakan algoritma kuat seperti Argon2id atau bcrypt dengan cost yang sesuai.
- Session menggunakan cookie HttpOnly, Secure di production, dan SameSite yang sesuai.
- Session dapat dicabut.
- Login memiliki rate limit.
- Pesan error login tidak membocorkan apakah email terdaftar.

## 21.2 Authorization

- RBAC diperiksa di server pada setiap action/route.
- Default deny.
- Record ownership/assignee rule diterapkan bila diperlukan.
- Preview token random, scoped, memiliki expiry, dan dapat dicabut.

## 21.3 Input dan Output

- Validasi semua input di server.
- Sanitize rich text.
- Escape output.
- ORM parameterized query; dilarang menyusun raw SQL dari input.
- URL eksternal divalidasi protokolnya.
- Redirect destination divalidasi untuk mencegah open redirect.

## 21.4 Upload

- Allowlist MIME dan extension.
- Verifikasi file signature bila memungkinkan.
- Batas ukuran jelas.
- Nama file di storage dibuat server-side.
- SVG hanya diizinkan bila disanitasi atau berasal dari admin tepercaya.
- Lampiran inquiry disimpan private.
- Download lampiran membutuhkan authorization dan signed URL berumur pendek.
- Jangan pernah mengeksekusi file upload.

## 21.5 Web Security

- Content Security Policy yang kompatibel dengan kebutuhan aplikasi.
- HSTS di production HTTPS.
- X-Content-Type-Options.
- Referrer-Policy.
- Frame protection melalui CSP frame-ancestors.
- CSRF/origin validation untuk mutation yang relevan.
- Rate limit untuk login, inquiry, preview token, dan upload.
- Dependency audit dijalankan.
- Error production tidak menampilkan stack trace atau secret.

## 21.6 Privacy

- Kumpulkan data lead secukupnya.
- Privacy policy menjelaskan tujuan dan masa simpan.
- Sediakan penghapusan/export manual oleh Super Admin.
- Jangan masukkan PII ke analytics.
- IP pada audit log dipersingkat, dimasking, atau di-hash sesuai kebutuhan legal.

---

# 22. Media dan Storage

## 22.1 Development

- Boleh menggunakan local storage adapter yang tidak masuk version control.
- Interface storage harus sama dengan production.

## 22.2 Production

- Gunakan S3-compatible object storage, Cloudinary, atau provider setara.
- Public website image dapat public/CDN.
- Inquiry attachment private.

## 22.3 Batas Awal

- Public image: maksimum 8 MB sebelum optimasi.
- Inquiry attachment: maksimum 10 MB per file.
- Maksimum tiga attachment per inquiry.
- Allowed public image: JPEG, PNG, WebP, AVIF; SVG dengan aturan khusus.
- Allowed inquiry attachment: PDF, JPEG, PNG, WebP; format lain hanya jika benar-benar dibutuhkan.

Nilai limit harus berada dalam configuration, bukan hard-coded tersebar.

---

# 23. Email dan Notifikasi

Event:

- New inquiry ke recipient admin.
- Acknowledgment ke calon klien.
- Admin invitation/reset password.
- Publish failure atau scheduled publish failure.
- Storage/backup failure bila sistem mendukung.

Requirement:

- Provider melalui adapter SMTP/API.
- Template branded tetapi ringan.
- Jangan mengirim data sensitif lengkap melalui subject.
- Link admin membutuhkan login.
- Retry terkontrol dan logging.
- Kegagalan email tidak boleh menghilangkan inquiry yang sudah tersimpan.

WhatsApp:

- Gunakan deep link dari nomor di settings.
- Pesan prefilled ringkas.
- Jangan auto-send.

---

# 24. SEO

- Metadata dinamis per route.
- Title dan description fallback dari global settings.
- Canonical URL.
- Open Graph dan social preview.
- Sitemap hanya berisi published/indexable content.
- robots.txt berbeda untuk development dan production.
- Structured data Organization, Service, Article, dan Breadcrumb sesuai halaman.
- Clean slug.
- 301 redirect saat slug published berubah.
- Alt text.
- Heading hierarchy benar.
- Internal linking.
- Pagination/search page indexing diatur dengan benar.
- 404 custom.
- OG image fallback berbasis brand, bukan screenshot acak.

SEO preview di CMS menampilkan perkiraan tampilan search/social, tetapi tidak mengklaim ranking.

---

# 25. Accessibility

Target WCAG 2.2 level AA.

Wajib:

- Semantic HTML.
- Skip link.
- Navigasi penuh dengan keyboard.
- Focus indicator jelas.
- Dialog focus trap.
- ESC menutup dialog/menu.
- Body text kontras.
- Touch target minimal 44 px.
- Label form nyata.
- Error form terhubung dengan aria-describedby.
- Success/error announcement memakai aria-live.
- Semua gambar bermakna memiliki alt text.
- Gambar dekoratif memakai alt kosong.
- Video memiliki kontrol dan caption bila mengandung dialog.
- prefers-reduced-motion dihormati.
- Jangan mengandalkan warna saja untuk menyampaikan status.
- Custom cursor tidak menghilangkan cursor native pada area penting.
- Slider Before/After memiliki alternatif keyboard/toggle.

Blur dan low opacity tidak boleh membuat tulisan hilang. Bila backdrop-filter tidak didukung, gunakan solid translucent fallback.

---

# 26. Responsive Design

## 26.1 Breakpoint Pengujian

| Lebar | Target |
|---:|---|
| 320–359 px | Ponsel sangat kecil |
| 360–479 px | Ponsel umum |
| 480–767 px | Ponsel besar |
| 768–1023 px | Tablet |
| 1024–1439 px | Laptop |
| 1440–1919 px | Desktop |
| 1920 px ke atas | Wide desktop |

## 26.2 Aturan

- Mobile-first.
- Tidak ada horizontal scroll kecuali komponen yang memang diberi affordance dan alternatif.
- Grid: 4 kolom mobile, 8 kolom tablet, 12 kolom desktop.
- Container memiliki max-width dan gutter fluid.
- Typography menggunakan clamp dalam batas aman.
- Hero visual pindah ke bawah teks pada mobile.
- Decorative object tidak boleh menutupi CTA.
- Card tilt dimatikan pada touch device.
- Hover bukan satu-satunya cara melihat informasi.
- Table admin berubah menjadi card/list atau horizontal scroll dengan label yang tetap jelas.
- Form admin dan public nyaman dipakai dengan virtual keyboard.
- Floating dock mempertimbangkan safe-area.
- Landscape mobile diuji.

---

# 27. Performance

- Gunakan Server Components secara default.
- Client bundle hanya memuat interaksi yang dibutuhkan.
- Dynamic import untuk 3D, editor, chart, dan drag-and-drop.
- Lazy-load media di bawah fold.
- Hero image/critical asset diprioritaskan secara tepat.
- Gunakan responsive image sizes.
- Hindari autoplay video.
- Animasi menggunakan transform/opacity.
- Hindari layout thrashing.
- Batasi jumlah objek bergerak bersamaan.
- Pause animasi saat section di luar viewport atau tab tidak aktif.
- 3D scene memiliki static fallback.
- Font subset dan weight dibatasi.
- Bundle analyzer disediakan sebagai script opsional.
- Tidak boleh ada artificial loading delay.

Jika efek 3D membuat target performance gagal, pertahankan art direction melalui SVG/CSS dan hapus WebGL; jangan mengorbankan pengalaman inti.

---

# 28. Analytics

Analytics provider harus dapat diganti dan dapat dimatikan.

Event minimum:

- page_view.
- nav_open.
- nav_item_click.
- primary_cta_click.
- whatsapp_click.
- service_view.
- project_view.
- project_filter.
- brief_started.
- brief_step_completed.
- brief_submitted.
- brief_error.

Aturan:

- Jangan kirim isi form atau PII.
- Utm source/medium/campaign boleh disimpan bersama inquiry bila consent dan policy sesuai.
- Jika analytics membutuhkan cookie non-esensial, tampilkan consent yang benar.
- Jangan membuat banner cookie palsu bila tidak ada cookie non-esensial.

---

# 29. State yang Wajib Dibuat

Setiap feature harus memiliki:

- Loading state.
- Empty state.
- Error state.
- Success state.
- Disabled state.
- Permission denied state bila relevan.
- Offline/retry behavior dasar untuk form.

Contoh:

- Project kosong: tampilkan concept playground yang jujur atau hidden section.
- Testimonial kosong: section hidden.
- Blog kosong: halaman menjelaskan insight akan hadir tanpa membuat artikel palsu.
- Search tanpa hasil: tampilkan reset filter.
- Image gagal: fallback visual brand.
- API error: pesan manusiawi dan tombol retry.

---

# 30. CMS Publishing Workflow

Status konten:

- DRAFT.
- REVIEW.
- SCHEDULED.
- PUBLISHED.
- ARCHIVED.

Alur:

1. Editor membuat draft.
2. Editor preview.
3. Editor mengirim untuk review bila role membutuhkan approval.
4. Publisher memperbaiki atau menerbitkan.
5. Sistem mencatat revision dan audit.
6. Cache route terkait direvalidasi.
7. Perubahan slug membuat redirect bila diperlukan.

Scheduled publishing membutuhkan mekanisme cron/scheduler yang terdokumentasi. Bila deployment environment tidak menyediakan scheduler, sediakan command/route cron aman yang dapat dipanggil provider.

---

# 31. Seed Content yang Aman

Seed boleh membuat:

- Satu akun admin hanya bila credential berasal dari environment.
- Global settings placeholder.
- Daftar layanan yang benar-benar ditawarkan.
- FAQ umum.
- Navigation item.
- Budget range.
- Dua concept project yang diberi label jelas sebagai Concept/Internal Experiment.

Seed dilarang membuat:

- Klien palsu.
- Logo perusahaan terkenal.
- Testimoni palsu.
- Statistik proyek palsu.
- Rating palsu.
- Alamat atau nomor kontak palsu yang terlihat nyata.

Starter copy yang aman:

- Hero: “Dari ide kecil jadi produk digital yang enak dipakai.”
- Subcopy: “Kami merancang dan membangun website, web application, serta dashboard yang terasa hidup, mudah dikelola, dan nyaman di semua layar.”
- CTA: “Ceritain Ide Kamu.”

Semua starter copy harus editable melalui CMS.

---

# 32. Environment Variables

Sediakan .env.example tanpa nilai secret.

Minimal:

- DATABASE_URL.
- AUTH_SECRET.
- AUTH_URL atau site URL sesuai auth implementation.
- NEXT_PUBLIC_SITE_URL.
- INITIAL_ADMIN_EMAIL.
- INITIAL_ADMIN_PASSWORD hanya untuk setup lokal dan tidak dipakai ulang di production.
- MAIL_PROVIDER/SMTP settings.
- MAIL_FROM.
- ADMIN_NOTIFICATION_EMAILS.
- STORAGE_DRIVER.
- STORAGE_BUCKET.
- STORAGE_REGION.
- STORAGE_ENDPOINT.
- STORAGE_ACCESS_KEY.
- STORAGE_SECRET_KEY.
- ANALYTICS_PROVIDER optional.
- ANALYTICS_ID optional.
- CAPTCHA keys optional.
- CRON_SECRET bila scheduled publishing membutuhkannya.

Validasi environment saat boot dan berikan error yang jelas tanpa mencetak secret.

---

# 33. Testing

## 33.1 Unit Test

- Validation schema.
- Slug generation.
- Reference number generation.
- Permission checks.
- Publishing state transitions.
- Price/budget formatting.
- SEO fallback.

## 33.2 Integration Test

- Login/logout.
- Session protection.
- CRUD service.
- CRUD project.
- Draft/preview/publish.
- Submit inquiry.
- Duplicate submit protection.
- Lead status change dan note.
- Media permission.
- Redirect creation.

## 33.3 End-to-End Test

Alur minimum:

1. Visitor membuka Home dan menu.
2. Visitor melihat service.
3. Visitor memfilter work.
4. Visitor mengisi project brief sampai sukses.
5. Admin login.
6. Admin melihat inquiry baru dan menambah note.
7. Admin membuat concept project.
8. Admin preview dan publish.
9. Project muncul di website publik.
10. Admin logout dan route admin kembali terlindungi.

## 33.4 Visual/Responsive QA

Uji:

- Chrome, Firefox, Safari/WebKit, dan Edge modern.
- Keyboard only.
- Reduced motion.
- High zoom 200%.
- 320 px mobile.
- Tablet portrait/landscape.
- Desktop 1366×768.
- Desktop besar.
- Slow network.
- Gambar gagal.
- Empty content.
- Long Indonesian copy.

---

# 34. Error Handling dan Observability

- Gunakan error boundary.
- Buat not-found dan global error page sesuai brand.
- Log server error dengan request/correlation ID.
- Jangan log password, token, isi attachment, atau full form PII.
- Inquiry yang tersimpan tetap dianggap berhasil walau notifikasi email gagal; tampilkan status internal untuk retry.
- Admin melihat error yang dapat ditindaklanjuti.
- Public melihat pesan sederhana tanpa stack trace.
- Health check route opsional untuk database dan storage tanpa membocorkan detail.

---

# 35. Backup, Export, dan Retention

- Database backup dijalankan oleh infrastructure/provider dan didokumentasikan.
- CMS menyediakan export inquiry CSV.
- Export content JSON opsional.
- Backup tidak boleh tersedia lewat public URL.
- Restore production tidak dijalankan otomatis dari UI tanpa konfirmasi tingkat tinggi.
- Soft-deleted inquiry memiliki retention period yang dapat dikonfigurasi.
- Attachment orphan dibersihkan melalui job aman setelah retention.

---

# 36. Deployment

Target:

- Next.js-compatible Node hosting.
- Managed MySQL.
- Object storage/CDN.
- HTTPS wajib.

Pipeline:

1. Install dependency dari lockfile.
2. Generate ORM client.
3. Lint.
4. Test.
5. Production build.
6. Jalankan migration production.
7. Deploy.
8. Smoke test.

Sediakan:

- README local development.
- README production deployment.
- Migration procedure.
- Seed/setup admin procedure.
- Backup guidance.
- Environment variable checklist.

Jangan hard-code deployment hanya untuk satu provider kecuali user memilih provider tersebut.

---

# 37. Tahap Implementasi untuk AI Agent

## Phase 0 — Audit dan Setup

- Periksa repository dan instruction files.
- Tentukan package manager.
- Setup Next.js, TypeScript, Tailwind, lint, test.
- Setup Prisma dan MySQL.
- Buat .env.example.
- Buat design tokens.

Exit criteria:

- Dev server berjalan.
- Database connection tervalidasi.
- Lint dan build dasar berhasil.

## Phase 1 — Design System dan Public Shell

- Font, colors, spacing, shadows, shapes.
- Primitive UI.
- Floating navigation.
- Menu overlay.
- Closing Playground.
- Loading/error/404.
- Reduced-motion.

Exit criteria:

- Shell responsive dan keyboard accessible.

## Phase 2 — Public Pages

- Home.
- Services.
- Work.
- About.
- Process.
- Insights.
- Contact.
- Legal.

Gunakan typed seed/static adapter sementara hanya sampai database integration pada phase berikut. Jangan menyatakan proyek selesai pada kondisi tersebut.

## Phase 3 — Database dan Authentication

- Prisma schema.
- Migration.
- Seed aman.
- Admin login/session.
- RBAC.
- Audit log dasar.

## Phase 4 — CMS Content

- Dashboard.
- Pages/sections.
- Services.
- Projects.
- Testimonials/clients/team.
- Blog/category/tag.
- FAQ.
- Navigation/theme/settings/SEO.
- Preview/publish/revision.

## Phase 5 — Inquiry dan Mini CRM

- Multi-step form.
- Persistence.
- Email.
- Lead table/Kanban.
- Notes/activity.
- Export.
- Attachment.
- Spam/rate limit.

## Phase 6 — Motion, 3D, dan Polish

- Hero visual.
- Section interactions.
- Route/menu transitions.
- Performance guard.
- Mobile fallbacks.

Animasi dikerjakan setelah layout, content, accessibility, dan feature flow stabil.

## Phase 7 — SEO, Security, Performance

- Metadata.
- Sitemap/robots/schema.
- Headers.
- Validation/sanitization.
- Rate limit.
- Image/font/bundle optimization.

## Phase 8 — QA dan Handover

- Unit/integration/e2e.
- Responsive QA.
- Build.
- README.
- Final checklist.

---

# 38. Definition of Done

Proyek hanya boleh dinyatakan selesai bila:

- Semua route wajib tersedia.
- Semua navigasi dan CTA bekerja.
- Tidak ada navbar/footer tradisional di publik.
- Floating blur navigation tetap terbaca.
- Home memiliki visual yang fun dan berbeda.
- 3D memiliki fallback.
- Seluruh perangkat utama responsive.
- Tidak ada horizontal overflow.
- CMS login aman.
- CMS memiliki role/permission server-side.
- Seluruh konten utama dapat dikelola dari CMS.
- Lead tersimpan dan terlihat di CMS.
- Form memiliki validasi server dan anti-spam.
- Draft/preview/publish bekerja.
- Media library bekerja.
- SEO dapat diedit.
- Sitemap dan robots valid.
- Tidak ada data bisnis palsu.
- Empty state benar.
- Reduced-motion bekerja.
- Keyboard navigation bekerja.
- Production build berhasil.
- Migration dan seed berhasil pada database kosong.
- Test alur utama lulus.
- README dan .env.example tersedia.
- Tidak ada secret di source control.
- Tidak ada TODO/FIXME/stub/mock yang menghalangi feature.
- Console browser bersih pada alur utama.

---

# 39. Acceptance Criteria Terperinci

## Public Website

- Saat visitor membuka Home di layar 320 px, hero, CTA, dan floating dock dapat dipakai tanpa zoom atau overflow.
- Saat Menu Orb dibuka, focus masuk ke overlay, TAB tetap berada di overlay, ESC menutup, dan focus kembali ke tombol.
- Saat reduced-motion aktif, parallax/tilt/3D animation berhenti tetapi konten tetap lengkap.
- Saat WebGL gagal, hero menampilkan fallback visual.
- Saat tidak ada testimonial/client metric, section tidak menampilkan data palsu atau area kosong besar.
- Saat concept project tampil, label Concept terlihat jelas.
- Saat route tidak ditemukan, user mendapat custom 404 dan link kembali.

## Form

- User tidak dapat lanjut jika step memiliki field wajib invalid.
- Refresh tidak menyebabkan duplicate submit.
- Submit valid membuat satu Inquiry.
- Failure email tidak menghapus Inquiry.
- Admin menerima indikator inquiry baru.
- User mendapat confirmation dengan reference number.
- Spam/rate-limit memberi response aman.

## CMS

- User tanpa session tidak dapat membuka route admin.
- Sales tidak dapat mengubah role atau settings.
- Content Editor tidak dapat mengakses export lead kecuali diberi permission.
- Publish project membuat route publik tersedia.
- Mengubah slug project published membuat redirect.
- Delete media yang masih dipakai ditolak dengan daftar dependency.
- Restore revision mengembalikan isi dan tercatat di audit log.
- Mobile CMS masih dapat menjalankan action utama.

## Quality

- npm run lint berhasil.
- npm run test berhasil.
- npm run build berhasil.
- Database kosong dapat dimigrasi dan disiapkan tanpa edit manual schema.
- Aplikasi tidak membutuhkan credential hard-coded.

---

# 40. Instruksi Final yang Dapat Ditempel ke AI Coding Agent

Bangun proyek berdasarkan dokumen ini secara menyeluruh. Jangan berhenti pada mockup atau frontend statis. Gunakan Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, dan MySQL. Website publik harus fun, penuh warna, handcrafted, memiliki motion dan progressive 3D yang terkontrol, tanpa navbar/footer tradisional. Gunakan floating glass navigation ber-opacity rendah tetapi tetap accessible.

Buat custom Admin CMS lengkap dan hubungkan semua konten ke database. Implementasikan authentication, RBAC server-side, page/section management, services, project/case study, testimonials, clients, team, blog, FAQ, media, SEO, settings, theme controls, audit log, dan inquiry mini CRM. Project brief harus tersimpan, memiliki validation, anti-spam, notifikasi, notes, pipeline status, attachment private, dan export.

Jangan membuat klaim, klien, statistik, testimonial, atau portofolio palsu. Concept project harus diberi label jujur. Section kosong harus hidden atau memiliki empty state yang tepat. Hindari desain template SaaS dan semua pola “AI slop” yang dilarang dalam PRD.

Kerjakan sesuai phase. Setelah tiap phase, jalankan pemeriksaan yang relevan. Pada akhir pekerjaan:

1. Jalankan migration dan seed pada database kosong.
2. Jalankan lint.
3. Jalankan seluruh test.
4. Jalankan production build.
5. Perbaiki semua error.
6. Berikan ringkasan file/fitur yang dibuat.
7. Berikan command instalasi dan running.
8. Jelaskan environment variable yang wajib diisi.
9. Laporkan test/build yang benar-benar dijalankan beserta hasilnya.
10. Jangan mengklaim sesuatu telah diuji jika command tidak benar-benar dijalankan.

Jika ada keputusan kecil yang belum disebut, pilih solusi yang paling sederhana, aman, accessible, dan konsisten dengan art direction. Hanya tanyakan kepada user bila keputusan tersebut mengubah scope, biaya layanan eksternal, data bisnis, atau arah brand secara material.

---

# 41. Informasi yang Perlu Diisi Pemilik Sebelum Launch

Tidak menghalangi agent memulai development, tetapi wajib dilengkapi sebelum production:

- Nama startup.
- Logo/brand mark.
- Tagline final.
- Deskripsi perusahaan.
- Daftar layanan final.
- Email.
- Nomor WhatsApp.
- Social links.
- Alamat atau area layanan.
- Jam respons.
- Range budget.
- Tim.
- Project nyata atau concept project yang disetujui.
- Kebijakan revisi.
- Terms dan privacy policy.
- Domain.
- Hosting/database/storage/email provider.

Semua informasi tersebut harus dapat diubah dari CMS.

---

# 42. Referensi Teknis Resmi

- Next.js App Router: https://nextjs.org/docs/app
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Next.js Server Actions/Mutating Data: https://nextjs.org/docs/app/getting-started/mutating-data
- Tailwind motion and reduced-motion utilities: https://tailwindcss.com/docs/animation
- Prisma with Next.js: https://www.prisma.io/docs/guides/frameworks/nextjs
- Prisma MySQL connector: https://www.prisma.io/docs/orm/overview/databases/mysql

Gunakan versi package yang saling kompatibel pada saat implementasi dan jangan menyalin nomor versi lama secara membabi buta.

