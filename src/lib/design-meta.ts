import {
  Globe,
  MousePointerClick,
  AppWindow,
  LayoutDashboard,
  SwatchBook,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceGoal, ServiceTone } from "@/lib/content";

type ServiceMeta = { icon: LucideIcon; tone: ServiceTone; goal: ServiceGoal };

const META: Record<string, ServiceMeta> = {
  "company-profile": { icon: Globe, tone: "purple", goal: "Branding" },
  "landing-page": { icon: MousePointerClick, tone: "lemon", goal: "Selling" },
  "web-application": { icon: AppWindow, tone: "sky", goal: "Custom App" },
  "dashboard-admin-cms": { icon: LayoutDashboard, tone: "mint", goal: "Operations" },
  "ui-implementation-redesign": { icon: SwatchBook, tone: "coral", goal: "Branding" },
  "maintenance-optimization": { icon: Wrench, tone: "purple", goal: "Operations" },
};

export function serviceMeta(slug: string): ServiceMeta {
  return (
    META[slug] ?? {
      icon: LayoutDashboard,
      tone: "purple",
      goal: "Operations",
    }
  );
}

type Step = { title: string; description: string };
type ServiceFaq = { question: string; answer: string };

const PROCESS: Record<string, Step[]> = {
  "company-profile": [
    { title: "Discovery", description: "Memahami tujuan, audiens, dan asset brand yang ada." },
    { title: "Wireframe & copy", description: "Struktur halaman dan draf teks disepakati lebih dulu." },
    { title: "Visual design", description: "Desain halaman utama dan variant section." },
    { title: "Development", description: "Bangun halaman, hubungkan formulir, dan optimasi." },
  ],
  "landing-page": [
    { title: "Klarifikasi tujuan", description: "Satu aksi utama yang ingin diminta dari pengunjung." },
    { title: "Copy & struktur", description: "Alur pesan dari ketertarikan sampai aksi." },
    { title: "Desain & build", description: "Desain responsif dengan fokus pada CTA." },
    { title: "Uji & rilis", description: "Pengecekan lintas perangkat sebelum launch." },
  ],
  "web-application": [
    { title: "Workshop kebutuhan", description: "Memetakan masalah, pengguna, dan data yang terlibat." },
    { title: "Prototipe alur", description: "Wireframe alur utama disetujui sebelum build." },
    { title: "Development bertahap", description: "Fitur diantarkan dalam beberapa tahap yang bisa dicek." },
    { title: "Testing & training", description: "Uji alur penting dan pelatihan pemakaian." },
  ],
  "dashboard-admin-cms": [
    { title: "Identifikasi kebutuhan", description: "Data dan tindakan apa yang paling sering dibutuhkan." },
    { title: "Desain antarmuka admin", description: "Tabel, form, dan alur yang efisien." },
    { title: "Development", description: "Bangun panel dan kaitkan ke data." },
    { title: "Training", description: "Panduan penggunaan untuk tim." },
  ],
  "ui-implementation-redesign": [
    { title: "Audit kondisi", description: "Menilai desain/kode yang ada dan titik masalahnya." },
    { title: "Rencana langkah", description: "Prioritas perbaikan sesuai dampak dan biaya." },
    { title: "Implementasi", description: "Bangun atau perbaiki per komponen halaman." },
    { title: "Verifikasi", description: "Cek responsif dan konsistensi visual." },
  ],
  "maintenance-optimization": [
    { title: "Audit awal", description: "Menilai dasar-dasar kondisi website saat gabung." },
    { title: "Jadwal perawatan", description: "Agenda pemantauan dan pembaruan berkala." },
    { title: "Eksekusi", description: "Pekerjaan bulanan sesuai kuota paket." },
  ],
};

const OUTCOME: Record<string, string> = {
  "company-profile": "Website resmi yang cepat, mudah dibaca, dan membuat bisnismu terlihat siap bekerja.",
  "landing-page": "Halaman fokus yang mengubah pengunjung, bukan sekadar 'rapi'.",
  "web-application": "Alat digital yang benar-benar dipakai timmu dan mengurangi pekerjaan manual.",
  "dashboard-admin-cms": "Tim punya kendali atas konten dan data dengan tetap terjaga keamanannya.",
  "ui-implementation-redesign": "Tampilan dan kode yang presisi, konsisten, dan mudah dirawat.",
  "maintenance-optimization": "Website yang stabil, aman, dan tetap cepat dalam jangka panjang.",
};

const FAQS: Record<string, ServiceFaq[]> = {
  "company-profile": [
    { question: "Apakah sudah termasuk konten teks?", answer: "Kami menyediakan kerangka copy standar berdasarkan informasi yang kamu kirim. Copy final sebaiknya dikonfirmasi timmu agar suara brand tetap milikmu." },
    { question: "Bisakah halamannya ditambah setelah selesai?", answer: "Bisa. Halaman tambahan masuk dalam paket maintenance atau pekerjaan lanjutan dengan penawaran terpisah." },
  ],
  "landing-page": [
    { question: "Berapa panjang halaman yang ideal?", answer: "Tergantung keputusan pembelian. Cukup panjang untuk menjawab keraguan, cukup pendek agar tidak kehilangan fokus — kami timbang bersama di fase discovery." },
  ],
  "web-application": [
    { question: "Apakah bisa diintegrasikan dengan sistem yang sudah ada?", answer: "Bergantung pada sistemnya. Kami petakan kebutuhan integrasi di fase discovery dan memberikan penilaian jujur sebelum memulai." },
  ],
  "dashboard-admin-cms": [
    { question: "Apakah admin bisa dipakai di ponsel?", answer: "Ya, antarmuka admin kami buat responsif. Aksi utama tetap bisa dijalankan dari ponsel, meski pekerjaan berat lebih nyaman di desktop." },
  ],
  "ui-implementation-redesign": [
    { question: "Apakah bisa mengerjakan hanya bagian tertentu saja?", answer: "Bisa. Kami bisa mengerjakan per halaman atau per komponen agar sesuai anggaranmu." },
  ],
  "maintenance-optimization": [
    { question: "Apakah ada komitmen kontrak?", answer: "Paket berjalan bulanan dan bisa dihentikan dengan pemberitahuan. Detail dijelaskan pada proposal." },
  ],
};

export function serviceProcess(slug: string): Step[] {
  return (
    PROCESS[slug] ?? [
      { title: "Discovery", description: "Memahami kebutuhan dan tujuan kamu lebih dulu." },
      { title: "Perencanaan", description: "Menyusun scope, konten, dan estimasi." },
      { title: "Pengerjaan", description: "Mengeksekusi sesuai rencana yang disepakati." },
      { title: "Rilis & dukungan", description: "Launch dan penyerahan hasil akhir." },
    ]
  );
}

export function serviceOutcome(slug: string): string {
  return OUTCOME[slug] ?? "Hasil akhir yang jelas, terukur, dan mudah dirawat.";
}

export function serviceFaqs(slug: string): ServiceFaq[] {
  return FAQS[slug] ?? [];
}
