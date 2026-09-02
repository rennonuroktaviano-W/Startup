export const siteConfig = {
  name: "KotakIde Studio",
  tagline: "Studio web kecil dengan ide besar.",
  description:
    "Kami merancang dan membangun website, web application, serta dashboard yang terasa hidup, mudah dikelola, dan nyaman di semua layar.",
  email: "halo@kotakide.studio",
  whatsapp: "6281234567890",
  whatsappDisplay: "+62 812-3456-7890",
  responseTime: "biasanya direspons dalam 1–2 hari kerja",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultOgTitle: "KotakIde Studio — Studio Website & Aplikasi",
  defaultOgDescription:
    "Dari ide kecil jadi produk digital yang enak dipakai. Website, web app, dan dashboard yang hidup dan mudah dikelola.",
  budgets: [
    { key: "under-5", label: "Di bawah Rp5 juta" },
    { key: "5to10", label: "Rp5–10 juta" },
    { key: "10to25", label: "Rp10–25 juta" },
    { key: "over-25", label: "Di atas Rp25 juta" },
    { key: "unknown", label: "Belum tahu, butuh konsultasi" },
  ],
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;