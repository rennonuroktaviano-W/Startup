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
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;