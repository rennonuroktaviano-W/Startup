import type { LucideIcon } from "lucide-react";
import {
  Globe,
  MousePointerClick,
  AppWindow,
  LayoutDashboard,
  SwatchBook,
  Wrench,
} from "lucide-react";

export type ServiceTone = "purple" | "lemon" | "sky" | "mint" | "coral";
export type ProjectType = "CLIENT" | "CONCEPT";
export type ServiceGoal = "Branding" | "Selling" | "Operations" | "Custom App";

export type Deliverable = { title: string; description: string };
export type ProcessStep = { title: string; description: string };

export type Service = {
  slug: string;
  name: string;
  icon: LucideIcon;
  tone: ServiceTone;
  goal: ServiceGoal;
  shortDescription: string;
  longDescription: string;
  targetClient: string;
  problemsSolved: string[];
  deliverables: Deliverable[];
  process: ProcessStep[];
  timelineText: string;
  priceMode: "PRICED" | "BY_SCOPE";
  startingPrice?: string;
  outcome: string;
  serviceFaqs: { question: string; answer: string }[];
};

export type ProjectService = { slug: string; name: string };
export type ProjectMetric = { label: string; value: string; sourceNote?: string };

export type Project = {
  slug: string;
  title: string;
  projectType: ProjectType;
  industry: string;
  year: number;
  summary: string;
  challenge: string;
  goals: string[];
  approach: string;
  highlights: string[];
  outcome: string;
  metrics: ProjectMetric[];
  services: ProjectService[];
  cover: { label: string; art: "browser" | "dashboard" | "phone" };
  galleryArts: { label: string; art: "browser" | "dashboard" | "phone" }[];
};

export type ProcessPhase = {
  slug: string;
  number: string;
  name: string;
  tone: ServiceTone;
  description: string;
  inputs: string[];
  activities: string[];
  outputs: string[];
  estimation: string;
  checkpoint: string;
};

export type Faq = { question: string; answer: string; category: FaqCategory };
export type FaqCategory = "General" | "Service" | "Process" | "Pricing";

export type NavigationItemConfig = {
  href: string;
  label: string;
  tone: ServiceTone;
  number: string;
};

export const budgetRanges = [
  { value: "under-5m", label: "Di bawah Rp5 juta" },
  { value: "5-10m", label: "Rp5–10 juta" },
  { value: "10-25m", label: "Rp10–25 juta" },
  { value: "above-25m", label: "Di atas Rp25 juta" },
  { value: "not-sure", label: "Belum tahu, butuh konsultasi" },
];

export const responseTimeText = "dalam 1×24 jam kerja";

const services: Service[] = [
  {
    slug: "company-profile",
    goal: "Branding",
    name: "Company Profile",
    icon: Globe,
    tone: "purple",
    shortDescription:
      "Website resmi yang membuat bisnis atau organisasi terlihat profesional dan mudah dipercaya.",
    longDescription:
      "Website company profile ditujukan untuk membangun kredibilitas: menjelaskan siapa kamu, apa yang kamu tawarkan, dan bagaimana orang bisa memulai. Kami menyusun struktur informasi yang jelas, copy yang membantu konversi, serta desain yang sesuai karakter brand.",
    targetClient:
      "UMKM, sekolah, organisasi, dan perusahaan kecil-menengah yang butuh kehadiran digital yang rapi.",
    problemsSolved: [
      "Informasi bisnis tercecer di sosial media dan sulit dipercaya calon pelanggan.",
      "Website lama terasa kaku, lambat, dan tidak mencerminkan brand.",
      "Tidak ada satu tempat resmi yang menjelaskan produk, nilai, dan cara kontak.",
    ],
    deliverables: [
      { title: "Struktur informasi & sitemap", description: "Peta halaman dan alur pengunjung yang jelas." },
      { title: "Desain halaman utama", description: "Desain kustom sesuai brand, bukan template generik." },
      { title: "Landing sections", description: "Halaman utama lengkap, termasuk akomodasi data revisi." },
      { title: "Formulir kontak", description: "Notifikasi langsung ke email tim kamu." },
      { title: "SEO dasar", description: "Meta, sitemap, dan Open Graph agar mudah ditemukan." },
    ],
    process: [
      { title: "Discovery", description: "Memahami tujuan, audiens, dan asset brand yang ada." },
      { title: "Wireframe & copy", description: "Struktur halaman dan draf teks disepakati lebih dulu." },
      { title: "Visual design", description: "Desain halaman utama dan variant section." },
      { title: "Development", description: "Bangun halaman, hubungkan formulir, dan optimasi." },
    ],
    timelineText: "2–4 minggu sesuai jumlah halaman",
    priceMode: "BY_SCOPE",
    outcome: "Website resmi yang cepat, mudah dibaca, dan membuat bisnismu terlihat siap bekerja.",
    serviceFaqs: [
      {
        question: "Apakah sudah termasuk konten teks?",
        answer:
          "Kami menyediakan kerangka copy standar berdasarkan informasi yang kamu kirim. Copy final sebaiknya dikonfirmasi timmu agar suara brand tetap milikmu.",
      },
      {
        question: "Bisakah halamannya ditambah setelah selesai?",
        answer:
          "Bisa. Halaman tambahan masuk dalam paket maintenance atau pekerjaan lanjutan dengan penawaran terpisah.",
      },
    ],
  },
  {
    slug: "landing-page",
    goal: "Selling",
    name: "Landing Page",
    icon: MousePointerClick,
    tone: "lemon",
    shortDescription:
      "Satu halaman fokus untuk mempromosikan produk, kampanye, atau penawaran yang bisa dikonversi.",
    longDescription:
      "Landing page dirancang untuk satu tujuan: membuat pengunjung mengambil satu aksi — mendaftar, membeli, atau menghubungi. Kami membatasi distraksi dan mengarahkan perhatian melalui alur copy dan desain yang berurutan.",
    targetClient:
      "Founder, personal brand, dan bisnis yang meluncurkan produk atau kampanye baru.",
    problemsSolved: [
      "Produk baru tidak punya halaman yang menjelaskan penawaran dengan fokus.",
      "Tingkat konversi iklan rendah karena halaman tujuan terlalu ramai.",
      "Kampanye tidak memiliki tempat untuk mengumpulkan pendaftaran.",
    ],
    deliverables: [
      { title: "Struktur konversi", description: "Susunan section yang membawa pengunjung ke CTA." },
      { title: "Copywriting support", description: "Draf teks untuk setiap section sesuai inputmu." },
      { title: "Form perolehan lead", description: "Formulir pendaftaran atau permintaan info." },
      { title: "A/B variant ringan", description: "Penyesuaian CTA atau headline bila kamu minta." },
      { title: "Analitik event dasar", description: "Pelacakan tombol utama tanpa mengirim data pribadi." },
    ],
    process: [
      { title: "Klarifikasi tujuan", description: "Satu aksi utama yang ingin diminta dari pengunjung." },
      { title: "Copy & struktur", description: "Alur pesan dari ketertarikan sampai aksi." },
      { title: "Desain & build", description: "Desain responsif dengan fokus pada CTA." },
      { title: "Uji & rilis", description: "Pengecekan lintas perangkat sebelum launch." },
    ],
    timelineText: "1–3 minggu",
    priceMode: "BY_SCOPE",
    outcome: "Halaman fokus yang mengubah pengunjung, bukan sekadar 'rapi'.",
    serviceFaqs: [
      {
        question: "Berapa panjang halaman yang ideal?",
        answer:
          "Tergantung keputusan pembelian. Cukup panjang untuk menjawab keraguan, cukup pendek agar tidak kehilangan fokus — kami timbang bersama di fase discovery.",
      },
    ],
  },
  {
    slug: "web-application",
    goal: "Custom App",
    name: "Web Application",
    icon: AppWindow,
    tone: "sky",
    shortDescription:
      "Aplikasi web kustom yang menyelesaikan alur kerja nyata, bukan sekadar website tampilan.",
    longDescription:
      "Web application dibuat untuk membantu operasional: sistem internal, portal pelanggan, marketplace kecil, atau aplikasi khusus industri. Kami bekerja dari pemahaman masalah dulu, lalu merancang data, alur, dan antarmuka yang efisien.",
    targetClient:
      "Startup dan perusahaan yang butuh alat digital untuk menggantikan proses manual atau sistem lama.",
    problemsSolved: [
      "Pencatatan manual rawan salah dan memakan waktu.",
      "Proses kerja tersebar di spreadsheet dan chat pribadi.",
      "Sistem lama lambat, sulit diubah, dan tidak memenuhi kebutuhan baru.",
    ],
    deliverables: [
      { title: "Dokumen kebutuhan", description: "Ruang lingkup dan alur kerja yang disepakati." },
      { title: "Desain database & API", description: "Struktur data dan interface yang terdokumentasi." },
      { title: "Antarmuka kustom", description: "Halaman aplikasi sesuai alur kerja pengguna." },
      { title: "Autentikasi & role", description: "Login aman dan hak akses per pengguna." },
      { title: "Dokumentasi penggunaan", description: "Panduan singkat untuk admin dan pengguna." },
    ],
    process: [
      { title: "Workshop kebutuhan", description: "Memetakan masalah, pengguna, dan data yang terlibat." },
      { title: "Prototipe alur", description: "Wireframe alur utama disetujui sebelum build." },
      { title: "Development bertahap", description: "Fitur diantarkan dalam beberapa tahap yang bisa dicek." },
      { title: "Testing & training", description: "Uji alur penting dan pelatihan pemakaian." },
    ],
    timelineText: "6–14 minggu sesuai kompleksitas",
    priceMode: "BY_SCOPE",
    outcome: "Alat digital yang benar-benar dipakai timmu dan mengurangi pekerjaan manual.",
    serviceFaqs: [
      {
        question: "Apakah bisa diintegrasikan dengan sistem yang sudah ada?",
        answer:
          "Bergantung pada sistemnya. Kami petakan kebutuhan integrasi di fase discovery dan memberikan penilaian jujur sebelum memulai.",
      },
    ],
  },
  {
    slug: "dashboard-admin-cms",
    goal: "Operations",
    name: "Dashboard & Admin CMS",
    icon: LayoutDashboard,
    tone: "mint",
    shortDescription:
      "Panel kendali dan sistem kelola konten yang membuat tim lepas dari urusan teknis.",
    longDescription:
      "Dashboard membantu tim memantau data dan mengambil keputusan, sedangkan Admin CMS memungkinkan mengubah isi website tanpa menyentuh kode. Kami merancang keduanya dengan prioritas kecepatan dan kejelasan — bukan animasi yang menghalangi kerja.",
    targetClient:
      "Bisnis yang ingin kelola konten sendiri dan tim yang butuh pantauan data operasional.",
    problemsSolved: [
      "Setiap perubahan website harus meminta developer.",
      "Data operasional tersebar dan tidak punya satu tampilan ringkas.",
      "Tidak ada kontrol siapa boleh mengubah apa.",
    ],
    deliverables: [
      { title: "Panel ringkas", description: "Ringkasan data penting pada satu layar." },
      { title: "Editor konten", description: "Ubah teks, gambar, dan status konten dengan mudah." },
      { title: "Hak akses", description: "Batasan peran agar tidak semua orang mengubah sembarangan." },
      { title: "Riwayat perubahan", description: "Catatan audit perubahan penting." },
    ],
    process: [
      { title: "Identifikasi kebutuhan", description: "Data dan tindakan apa yang paling sering dibutuhkan." },
      { title: "Desain antarmuka admin", description: "Tabel, form, dan alur yang efisien." },
      { title: "Development", description: "Bangun panel dan kaitkan ke data." },
      { title: "Training", description: "Panduan penggunaan untuk tim." },
    ],
    timelineText: "4–8 minggu",
    priceMode: "BY_SCOPE",
    outcome: "Tim punya kendali atas konten dan data dengan tetap terjaga keamanannya.",
    serviceFaqs: [
      {
        question: "Apakah admin bisa dipakai di ponsel?",
        answer:
          "Ya, antarmuka admin kami buat responsif. Aksi utama tetap bisa dijalankan dari ponsel, meski pekerjaan berat lebih nyaman di desktop.",
      },
    ],
  },
  {
    slug: "ui-implementation-redesign",
    goal: "Branding",
    name: "UI Implementation / Redesign",
    icon: SwatchBook,
    tone: "coral",
    shortDescription:
      "Mengubah desain menjadi kode rapi, atau meremajakan tampilan lama tanpa membuang kerja kerasmu.",
    longDescription:
      "Kamu punya desain di Figma yang perlu diimplementasikan ke kode berkualitas, atau website yang sudah ada tapi tampilannya ketinggalan zaman dan sulit dirawat. Kami menangani keduanya dengan hasil akhir yang konsisten dan mudah dikelola.",
    targetClient:
      "Tim yang punya desain dan butuh implementasi, atau bisnis yang websitenya perlu disegarkan.",
    problemsSolved: [
      "Desain menarik tapi implementasinya tidak presisi.",
      "Website lama sulit diubah karena kode berantakan.",
      "Tampilan tidak konsisten di berbagai ukuran layar.",
    ],
    deliverables: [
      { title: "Implementasi presisi", description: "Desain diterjemahkan dengan detail dan lintas browser." },
      { title: "Komponen reusable", description: "Kode modular agar perawatan ke depan lebih mudah." },
      { title: "Perbaikan visual", description: "Penyegaran warna, tipografi, dan tata letak." },
      { title: "Dokumentasi singkat", description: "Catatan kode dan cara mengubah isi." },
    ],
    process: [
      { title: "Audit kondisi", description: "Menilai desain/kode yang ada dan titik masalahnya." },
      { title: "Rencana langkah", description: "Prioritas perbaikan sesuai dampak dan biaya." },
      { title: "Implementasi", description: "Bangun atau perbaiki per komponen halaman." },
      { title: "Verifikasi", description: "Cek responsif dan konsistensi visual." },
    ],
    timelineText: "2–6 minggu",
    priceMode: "BY_SCOPE",
    outcome: "Tampilan dan kode yang presisi, konsisten, dan mudah dirawat.",
    serviceFaqs: [
      {
        question: "Apakah bisa mengerjakan hanya bagian tertentu saja?",
        answer:
          "Bisa. Kami bisa mengerjakan per halaman atau per komponen agar sesuai anggaranmu.",
      },
    ],
  },
  {
    slug: "maintenance-optimization",
    goal: "Operations",
    name: "Maintenance & Optimization",
    icon: Wrench,
    tone: "purple",
    shortDescription:
      "Perawatan berkala, pembaruan, dan optimasi performa agar website tetap sehat setelah launch.",
    longDescription:
      "Website tidak selesai saat online pertama kali. Paket ini mencakup pemantauan, pembaruan sistem, perbaikan bug, keamanan dasar, dan optimasi kecepatan agar pengalaman pengguna tetap terjaga.",
    targetClient:
      "Klien lama kami dan bisnis lain yang websitenya butuh perawatan berkelanjutan.",
    problemsSolved: [
      "Tidak ada yang menangani pembaruan dan perbaikan kecil.",
      "Website mulai melambat atau sering error tanpa diketahui penyebabnya.",
      "Risiko keamanan menumpuk karena komponen tidak diperbarui.",
    ],
    deliverables: [
      { title: "Pemantauan berkala", description: "Cek uptime dan kesehatan dasar sistem." },
      { title: "Pembaruan aman", description: "Update versi dengan pengujian sebelum rilis." },
      { title: "Perbaikan bug", description: "Menangani error yang dilaporkan sesuai kuota bulanan." },
      { title: "Laporan ringkas", description: "Ringkasan pekerjaan yang dilakukan tiap periode." },
    ],
    process: [
      { title: "Audit awal", description: "Menilai dasar-dasar kondisi website saat gabung." },
      { title: "Jadwal perawatan", description: "Agenda pemantauan dan pembaruan berkala." },
      { title: "Eksekusi", description: "Pekerjaan bulanan sesuai kuota paket." },
    ],
    timelineText: "Bulanan (per paket)",
    priceMode: "BY_SCOPE",
    outcome: "Website yang stabil, aman, dan tetap cepat dalam jangka panjang.",
    serviceFaqs: [
      {
        question: "Apakah ada komitmen kontrak?",
        answer:
          "Paket berjalan bulanan dan bisa dihentikan dengan pemberitahuan. Detail dijelaskan pada proposal.",
      },
    ],
  },
];

const conceptProjects: Project[] = [
  {
    slug: "design-system-kotakide",
    title: "Design System KotakIde",
    projectType: "CONCEPT",
    industry: "Internal Experiment",
    year: 2026,
    summary:
      "Eksperimen internal untuk membangun sistem desain yang playful namun kompeten — dipakai sebagai bahan uji untuk website ini sendiri.",
    challenge:
      "Membangun bahasa visual 'creative toybox' tanpa jatuh ke kesan mainan anak atau template SaaS generik, dengan aturan kontras dan accessibility yang bisa dipertanggungjawabkan.",
    goals: [
      "Menetapkan design token warna, tipografi, dan shape language.",
      "Menjamin kontras teks memenuhi WCAG level AA.",
      "Menciptakan komponen yang konsisten di 320 px sampai layar besar.",
    ],
    approach:
      "Mulai dari token warna dan tipografi, lalu membangun komponen primitif (button, input, card, dialog) sebelum merakit section halaman. Semua keputusan dicatat supaya bisa dikelola dari CMS ke depan.",
    highlights: [
      "Palet 9 token dengan aturan 'maksimal tiga warna dominan per viewport'.",
      "Shadow berlapis dan outline 2 px sebagai bahasa bentuk konsisten.",
      "Grain tipis (3–4% opacity) untuk tekstur tanpa merusak keterbacaan.",
    ],
    outcome:
      "Sistem dasar yang hidup, dapat diakses, dan menjadi fondasi untuk halaman serta proyek klien berikutnya.",
    metrics: [],
    services: [{ slug: "ui-implementation-redesign", name: "UI Implementation / Redesign" }],
    cover: { label: "Browser window menampilkan design token", art: "browser" },
    galleryArts: [
      { label: "Palet warna dan token spacing", art: "browser" },
      { label: "Contoh komponen tombol dan kartu", art: "browser" },
    ],
  },
  {
    slug: "pos-concept-warung",
    title: "Concept: Aplikasi Kasir Mini untuk UMKM",
    projectType: "CONCEPT",
    industry: "Concept Project",
    year: 2026,
    summary:
      "Studi konsep internal untuk membayangkan aplikasi kasir sederhana yang bisa dipakai warung dan toko kecil tanpa pelatihan rumit.",
    challenge:
      "Merancang alur transaksi yang selesai dalam beberapa ketukan, tetap berfungsi saat internet lambat, dan bisa dikelola oleh pemilik yang tidak terbiasa dengan perangkat lunak kompleks.",
    goals: [
      "Alur input produk, transaksi, dan struk dalam waktu kurang dari 30 detik.",
      "Tampilan yang nyaman dipakai di tablet murah.",
      "Laporan omzet harian yang mudah dibaca.",
    ],
    approach:
      "Berangkat dari observasi sederhana tata cara warung, lalu menyusun wireframe alur kasir, menguji urutan layar, dan membuat konsep antarmuka dasar.",
    highlights: [
      "Struktur 3 layar utama: kasir, katalog produk, dan laporan.",
      "Tombol besar dengan urutan aksi sesuai kebiasaan fisik toko.",
      "Preview laporan harian berbentuk kartu, bukan tabel tebal.",
    ],
    outcome:
      "Sebuah konsep yang siap diarahkan menjadi produk nyata bila ada klien atau pendanaan yang cocok.",
    metrics: [],
    services: [{ slug: "web-application", name: "Web Application" }],
    cover: { label: "Tampilan tablet aplikasi kasir", art: "phone" },
    galleryArts: [
      { label: "Layar transaksi kasir", art: "phone" },
      { label: "Kartu laporan harian", art: "dashboard" },
    ],
  },
];

export const processPhases: ProcessPhase[] = [
  {
    slug: "ngobrol",
    number: "01",
    name: "Ngobrol",
    tone: "purple",
    description:
      "Kami mulai dengan mendengarkan: tujuan bisnis, masalah yang dihadapi, dan ekspektasi kamu.",
    inputs: ["Gambaran ide atau masalah", "Contoh website yang kamu suka"],
    activities: [
      "Diskusi kebutuhan dan sasaran",
      "Menilai scope dan kemungkinan teknis",
      "Memberikan estimasi jujur",
    ],
    outputs: ["Ringkasan kebutuhan", "Rekomendasi solusi"],
    estimation: "1 hari",
    checkpoint: "Kesepakatan arah sebelum proposal.",
  },
  {
    slug: "rancang",
    number: "02",
    name: "Rancang",
    tone: "sky",
    description:
      "Menyusun struktur, konten, dan visual. Di fase ini semua masih bisa diubah tanpa rugi.",
    inputs: ["Konten/bahan yang kamu punya", "Persetujuan struktur"],
    activities: [
      "Wireframe dan sitemap",
      "Layout visual",
      "Draft teks yang membantu konversi",
    ],
    outputs: ["Desain halaman utama", "Struktur halaman tambahan"],
    estimation: "3–10 hari",
    checkpoint: "Persetujuan desain sebelum development.",
  },
  {
    slug: "bangun",
    number: "03",
    name: "Bangun",
    tone: "lemon",
    description:
      "Desain menjadi kode sungguhan: responsif, cepat, dan diuji di berbagai perangkat.",
    inputs: ["Desain final yang disetujui", "Akses kebutuhan (domain, dsb.)"],
    activities: [
      "Development halaman & sistem",
      "Uji lintas browser dan perangkat",
      "Optimasi kecepatan dasar",
    ],
    outputs: ["Website/ aplikasi yang bisa dites", "Staging preview"],
    estimation: "1–8 minggu",
    checkpoint: "Hasil build dapat direview sebelum rilis.",
  },
  {
    slug: "luncur",
    number: "04",
    name: "Luncur",
    tone: "mint",
    description:
      "Rilis ke publik, training singkat, dan dukungan agar website tetap sehat.",
    inputs: ["Persetujuan final", "Kredensial domain/hosting"],
    activities: [
      "Deploy ke hosting",
      "Training kelola konten",
      "Pemantauan awal",
    ],
    outputs: ["Website online", "Panduan singkat"],
    estimation: "2–7 hari",
    checkpoint: "Website live dan diserahkan.",
  },
];

export const principles = [
  {
    title: "Jelas sebelum ramai",
    description: "Konten yang mudah dipahami lebih berharga daripada hiasan yang banyak.",
  },
  {
    title: "Fun tanpa mengganggu fungsi",
    description: "Citra ceria boleh datang, tapi tidak boleh menghalangi pengguna menyelesaikan tujuan.",
  },
  {
    title: "Mobile bukan versi sisa",
    description: "Keputusan desain dimulai dari layar kecil, bukan dipangkas setelahnya.",
  },
  {
    title: "Konten mudah dikelola",
    description: "Pemilik bisa mengubah isi tanpa harus memahami kode.",
  },
  {
    title: "Tidak berhenti saat online",
    description: "Website dirawat, dipantau, dan diperbaiki setelah peluncuran.",
  },
];

export type DetailedStage = {
  name: string;
  clientInput: string;
  activities: string[];
  outputs: string;
  estimation: string;
  checkpoint: string;
};

export const detailedProcess: DetailedStage[] = [
  {
    name: "Discovery",
    clientInput: "Gambaran ide, contoh yang disukai, dan jawaban pertanyaan singkat kami.",
    activities: [
      "Diskusi tujuan bisnis dan audiens",
      "Identifikasi masalah yang mau diselesaikan",
      "Penilaian awal scope dan kelayakan",
    ],
    outputs: "Ringkasan kebutuhan dan rekomendasi solusi",
    estimation: "1 hari",
    checkpoint: "Kesepakatan arah pengerjaan.",
  },
  {
    name: "Proposal & Scope",
    clientInput: "Persetujuan arah dan anggaran yang dimiliki.",
    activities: [
      "Pembagian tahapan dan deliverables",
      "Estimasi waktu dan harga sesuai scope",
      "Penyesuaian prioritas bila perlu",
    ],
    outputs: "Proposal tertulis yang jelas",
    estimation: "1–3 hari",
    checkpoint: "Tanda tangan persetujuan proposal.",
  },
  {
    name: "Pengumpulan Konten",
    clientInput: "Teks, foto, logo, dan bahan brand yang dimiliki.",
    activities: [
      "Templat pengumpulan konten",
      "Saran penyederhanaan konten",
      "Validasi konten yang diterima",
    ],
    outputs: "Konten final untuk diolah",
    estimation: "Paralel dengan desain",
    checkpoint: "Konten disetujui dan lengkap.",
  },
  {
    name: "Wireframe",
    clientInput: "Feedback urutan informasi pada struktur awal.",
    activities: [
      "Struktur halaman dan alur pengunjung",
      "Penentuan urutan section",
      "Preset bagian penting (CTA, kontak)",
    ],
    outputs: "Wireframe/kerangka halaman",
    estimation: "2–4 hari",
    checkpoint: "Persetujuan kerangka sebelum visual.",
  },
  {
    name: "Visual Design",
    clientInput: "Feedback warna, suasana, dan gaya visual.",
    activities: [
      "Desain halaman utama sesuai brand",
      "Penerapan design system & variant section",
      "Revisi terbatas sesuai kesepakatan",
    ],
    outputs: "Desain final halaman utama",
    estimation: "3–7 hari",
    checkpoint: "Persetujuan desain sebelum development.",
  },
  {
    name: "Development",
    clientInput: "Persetujuan desain dan akses teknis kebutuhan (domain, dsb.).",
    activities: [
      "Bangun halaman responsif",
      "Hubungkan formulir, CMS, dan sistem",
      "Optimasi kecepatan dasar",
    ],
    outputs: "Hasil build yang bisa ditinjau (staging)",
    estimation: "1–8 minggu sesuai scope",
    checkpoint: "Hasil build direview sebelum rilis.",
  },
  {
    name: "Testing",
    clientInput: "Laporan bug/masalah dari hasil coba timmu.",
    activities: [
      "Uji lintas browser dan perangkat",
      "Periksa aksesibilitas dasar",
      "Perbaikan bug yang ditemukan",
    ],
    outputs: "Build stabil yang siap rilis",
    estimation: "2–5 hari",
    checkpoint: "Build lolos cek kualitas internal.",
  },
  {
    name: "Launch",
    clientInput: "Kredensial hosting/domain dan persetujuan final.",
    activities: [
      "Deploy ke hosting produksi",
      "Setup domain dan HTTPS",
      "Verifikasi pasca-rilis",
    ],
    outputs: "Website/aplikasi online",
    estimation: "1–3 hari",
    checkpoint: "Website live dan bisa diakses publik.",
  },
  {
    name: "Handover & Training",
    clientInput: "Waktu tim untuk belajar kelola konten.",
    activities: [
      "Pelatihan penggunaan admin singkat",
      "Panduan ringkas berbahasa sehari-hari",
      "Penyerahan dokumen dan akun penting",
    ],
    outputs: "Tim bisa mengelola konten mandiri",
    estimation: "1 hari",
    checkpoint: "Pelatihan selesai dan tim paham.",
  },
  {
    name: "Maintenance",
    clientInput: "Laporan masalah dan permintaan perubahan kecil.",
    activities: [
      "Pemantauan uptime dan kesehatan sistem",
      "Pembaruan versi aman",
      "Perbaikan sesuai kuota paket",
    ],
    outputs: "Website tetap sehat dan aman",
    estimation: "Bulanan (per paket)",
    checkpoint: "Laporan ringkas tiap periode.",
  },
];

export const homeFaqs: Faq[] = [
  {
    question: "Berapa lama membuat website?",
    answer:
      "Tergantung jenis dan kompleksitas. Sebuah landing page bisa selesai 1–3 minggu, sedangkan web application dengan banyak fitur bisa 6–14 minggu. Estimasi realistis selalu kami berikan di fase discovery sebelum kamu berkomitmen.",
    category: "Process",
  },
  {
    question: "Apakah website bisa diedit sendiri?",
    answer:
      "Bisa. Kami menyertakan akses kelola konten (admin) yang ramah non-teknis untuk mengubah teks, gambar, dan status halaman. Kami juga memberikan panduan singkat pemakaiannya.",
    category: "General",
  },
  {
    question: "Apakah sudah responsive?",
    answer:
      "Selalu. Semua hasil kerja kami diuji dari layar 320 px (ponsel kecil) sampai desktop besar, termasuk keyboard navigation dan mode reduced-motion.",
    category: "General",
  },
  {
    question: "Apakah termasuk domain dan hosting?",
    answer:
      "Biaya domain dan hosting biasanya terpisah dari biaya pembuatan karena bersifat berulang per tahun. Kami membantu memilihkan dan menyiapkannya pada fase launch.",
    category: "Pricing",
  },
  {
    question: "Bagaimana proses revisi?",
    answer:
      "Revisi dibahas di fase desain dan development sebelum final. Jumlah putaran revisi disepakati di awal sehingga tidak ada kejutan di tengah jalan.",
    category: "Process",
  },
  {
    question: "Apakah menerima jasa maintenance?",
    answer:
      "Ya. Tersedia paket maintenance bulanan untuk pembaruan, perbaikan, pemantauan, dan optimasi performa. Rincian kuota disesuaikan kebutuhan.",
    category: "General",
  },
];

export const servicesList: Service[] = services;
export const projectsList: Project[] = conceptProjects;

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return conceptProjects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return conceptProjects.filter((p) => p.projectType === "CONCEPT");
}