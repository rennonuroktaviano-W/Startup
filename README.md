# KotakIde Studio — Company Profile + CMS

Website company profile untuk **KotakIde Studio** (studio web & aplikasi) lengkap dengan
CMS (Content Management System) admin. Dibangun dengan Next.js App Router, Prisma, dan
PostgreSQL/MySQL, serta dirancang dengan identitas visual "toy-like", playful, dan hidup.

> Seluruh konten editorial dimuat dari database melalui CMS (tidak ada hardcode konten).
> Project di area **Work** yang saat ini tampil adalah concept project internal ("CONCEPT")
> sebagai placeholder jujur sampai karya klien siap dipublikasikan.

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Persiapan & Menjalankan](#persiapan--menjalankan)
- [Scripts](#scripts)
- [Struktur Proyek](#struktur-proyek)
- [Area Publik](#area-publik)
- [Area Admin (CMS)](#area-admin-cms)
- [Database & Seed](#database--seed)
- [Pengujian](#pengujian)
- [SEO, Keamanan, & Performa](#seo-keamanan--performa)
- [Deployment](#deployment)
- [Fase Pengembangan](#fase-pengembangan)

## Fitur

**Publik**

- Home, Services, Work (project), About, Process, Insights (blog), Contact, Privacy, Terms.
- Halaman dan metadata SEO dinamis dari database per halaman.
- Inquiry berfungsi penuh: validasi server, honeypot anti-spam, rate-limit, dan
  acknowledgment email otomatis.
- Animasi playful dengan dukungan `prefers-reduced-motion` + penghentian animasi saat
  tab tersembunyi / hero keluar viewport (guarantee performa).
- Motion (Phase 6): hero visual dengan entrance bertahap & elemen mengambang, card tilt
  (desktop/touch-aware), squash-and-release tombol, transisi rute (~350ms), aksen
  micro-interaction pada menu overlay dan custom cursor yang membesar di elemen interaktif.

**Admin (CMS)**

- Dashboard, manajemen konten: services, projects, blog/insights, clients, testimonials,
  team, users, FAQ, navigation, settings, media.
- Mini CRM inquiry/lead: tabel & kanban, filter, bulk update, status, assignment, notes
  (pin/hapus), timeline aktivitas, archive/restore, export CSV (RBAC `leads:export`).
- Kontrol akses berbasis capability per role (SUPER_ADMIN / CONTENT_EDITOR / SALES).
- Audit log aktivitas penting (RBAC `audit:read`).

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** Tailwind CSS, Radix Primitives, `motion`, `lucide-react`, `sonner`
- **Data:** Prisma ORM, PostgreSQL/MySQL
- **Editor konten:** TipTap (rich text)
- **Email:** Nodemailer
- **Validasi:** Zod, sanitize-html
- **Testing:** Vitest (unit), Playwright (e2e)
- **PWA/SEO:** `sitemap.ts`, `robots.ts`, JSON-LD structured data

## Persiapan & Menjalankan

1. Instalasi dependensi:

   ```bash
   npm install
   ```

2. Siapkan `.env` (lihat `.env.example`). Isi minimal:

   ```env
   DATABASE_URL="mysql://user:pass@host:port/kotakide"
   INITIAL_ADMIN_EMAIL="admin@kotakide.test"
   INITIAL_ADMIN_PASSWORD="<password sementara>"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   # konfigurasi email (SMTP) — lihat src/lib/mail.ts
   ```

3. Migrasi database & seed:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000). Area admin di `/admin`.

## Scripts

| Perintah            | Fungsi                                            |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Development server                                |
| `npm run build`     | Production build                                  |
| `npm run start`     | Menjalankan hasil build                           |
| `npm run typecheck` | Tipe-chek seluruh proyek (`tsc --noEmit`)         |
| `npm run lint`      | ESLint                                            |
| `npm test`          | Unit test (Vitest)                                |
| `npm run test:watch`| Unit test watch mode                              |
| `npm run test:e2e`  | E2E test (Playwright)                             |
| `npm run db:generate` | Regenerasi Prisma client                       |
| `npm run db:migrate`  | Jalankan migration ke database                  |
| `npm run db:deploy`   | Terapkan migration tanpa konfirmasi             |
| `npm run db:seed`     | Seed data awal dan concept project              |

Bantuan lokal untuk DB (Laragon/portable): `scripts/db-start.ps1`, `scripts/db-stop.ps1`.

## Struktur Proyek

```
src/
  app/
    (public)/        # halaman publik (home, services, work, about, process, insights, contact)
    (admin)/         # area admin/CMS (harus autentikasi)
    api/             # route handler (uploads, leads/export)
    layout.tsx       # root layout: metadata, JSON-LD Organization
    globals.css      # design token, toy-style, reduced-motion
    sitemap.ts       # sitemap.xml
    robots.ts        # robots.txt
  actions/           # Server Actions (server-side logic + validasi Zod)
  components/        # komponen UI publik & admin, motion
  lib/               # logika murni, Prisma, SEO, email, rate-limit, permissions
  prisma/            # schema.prisma + seed.ts
tests/               # unit test (Vitest)
```

## Area Publik

Semua data yang dirender bisa (dengan pengecualian konten editorial statis yang sengaja
ditulis tangan seperti prinsip/FAQ) dimuat dari database melalui modul `src/lib/public-data.ts`
dan `src/lib/content-articles.ts`, serta query pada masing-masing halaman. Halaman `Work`
sepenuhnya digerakkan oleh tabel `Project`; concept project di-seed sebagai placeholder jujur.

## Area Admin (CMS)

Login di `/admin/login`. Setelah masuk:

- Navigasi dikelola lewat halaman **Navigation** (visible order, CTA, ikon).
- Konten dikelola dengan form + rich text (TipTap); preview disediakan.
- Authorization berbasis `Capability` (lihat `src/lib/permissions.ts`).

### Script (referensi RBAC)

| Capability       | Penggunaan utama                                   |
| ---------------- | --------------------------------------------------- |
| `content:*`      | CRUD services, projects, blog, testimonials, dst.   |
| `leads:read`     | Melihat inquiry/lead                                |
| `leads:write`    | Ubah status, assign, notes                          |
| `leads:export`   | Export CSV lead                                     |
| `media:write`    | Upload media                                        |
| `settings:write` | Ubah pengaturan/contact                             |
| `users:manage`   | Kelola user                                         |
| `audit:read`     | Lihat audit log                                     |

Selalu sertakan `requireCapability(role, capability)` pada mutasi server.

## Database & Seed

Model data utama di `prisma/schema.prisma`: `User`, `Service`, `Project`
(`ProjectService`, `ProjectMetric`, `ProjectMedia`), `BlogPost`, `Client`, `Testimonial`,
`TeamMember`, `Lead`, `InquiryNote`, `Faq`, `NavigationItem`, `SiteSetting`, `AuditLog`, dst.

Sebagian model memakai kolom JSON (mis. `challengeJson`, `goalsJson`) yang memetakan
konten publik — diubah via CMS dan dibaca melalui helper di `public-data.ts`.

Perintah seed:
- `INITIAL_ADMIN_EMAIL`/`INITIAL_ADMIN_PASSWORD` → user admin awal.
- Service, FAQ, navigasi, dan **2 concept project ("CONCEPT")** dibuat dengan `db:seed`.

## Pengujian

- **Unit (Vitest):** meliputi `src/lib/utils.ts`, `src/lib/permissions.ts`, `src/lib/leads.ts`,
  `src/lib/seo.ts`, `src/lib/content.ts`, `src/lib/site.ts`, dan skema validasi inquiry
  (`tests/validation.test.ts`). Menjalankan: `npm test`.
- **E2E (Playwright):** `npm run test:e2e` (direktori pengujian di `tests/e2e/`). Mencakup
  alur lengkap §33.3 (brief → prospek → konsep published → logout), plus public navigation
  (menu overlay, services, filter work) dan smoke test.

Konfigurasi Vitest di `vitest.config.ts` (memetakan `server-only` untuk unit test).

## SEO, Keamanan, & Performa

- `sitemap.xml` dinamis mencakup services, projects, dan arti­kel published; `robots.txt`
  memblokir `/admin` dan `/api`.
- Metadata per halaman via `buildMetadata` (`src/lib/seo.ts`) plus JSON-LD `Organization`.
- Security headers aktif di `next.config.ts` (HSTS, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), `poweredByHeader: false`.
- Performa: penghentian animasi saat tab tersembunyi/offscreen (`VisibilityPause`) dan
  menghormati `prefers-reduced-motion`.
- Motion baru (Phase 6) seluruhnya membungkus animasi pada `transform`/`opacity` agar
  tidak memicu layout thrashing, dan `CardTilt` hanya aktif pada `pointer: fine` (non-touch).

## Deployment

Standar Next.js. Set `.env` production (`DATABASE_URL`, email, `NEXT_PUBLIC_SITE_URL`),
jalankan `npm run db:deploy` untuk menerapkan migration, lalu:

```bash
npm run build
npm run start
```

Ke Vercel: push ke repo lalu hubungkan proyek, atau `vercel --prod`. Pastikan Prisma
generate dijalankan pada saat build (`npm run db:generate && npm run build`).

## Fase Pengembangan

Pengerjaan dibagi fase dengan tanda commit yang konsisten (`feat(phaseN): ...`) dan
dokumen kebenaran `PRD_Blueprint_Startup_Web_Application_Studio.md` di root. Semua fase,
acceptance criteria, dan Definition of Done tercantum di sana.