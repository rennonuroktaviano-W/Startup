import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

// Langkah 1 — Visitor membuka Home dan menu via floating navigation.
test("§33.3 langkah 1-2: home, menu overlay, dan halaman services", async ({ page }) => {
  await page.goto("/");

  // Hero terlihat.
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

  // Tidak ada navbar/footer tradisional.
  await expect(page.locator("header nav")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);

  // Buka menu overlay lewat orb.
  const orb = page.getByRole("button", { name: /buka menu/i }).first();
  await expect(orb).toBeVisible();
  await orb.click();

  // Overlay fokus dan dialog menu muncul.
  await expect(page.getByRole("dialog", { name: /menu utama/i })).toBeVisible();
  await expect(page.getByText("Main dulu, yuk.")).toBeVisible();

  // Navigasi ke layanan lewat menu lalu overlay menutup.
  await page.getByRole("link", { name: /services/i }).first().click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole("dialog", { name: /menu utama/i })).toHaveCount(0);

  // Langkah 2 — Visitor melihat daftar layanan.
  await expect(page.getByText(/Company Profile/i).first()).toBeVisible();
  await expect(page.getByText(/Landing Page/i).first()).toBeVisible();
});

// Langkah 3 — Visitor memfilter work.
test("§33.3 langkah 3: memfilter work", async ({ page }) => {
  await page.goto("/work");
  await expect(page).toHaveURL(/\/work$/);

  // Minimal ada satu konsep yang tampil.
  await expect(page.getByText(/Concept \/ Internal Experiment/i).first()).toBeVisible();

  // Filter berdasarkan status "Proyek klien" — tidak boleh ada hasil karena kosong,
  // namun empty state memunculkan tombol reset filter.
  await page.getByRole("combobox", { name: /status proyek/i }).selectOption("CLIENT");
  await expect(page.getByText("Tidak ada hasil")).toBeVisible();
  await page.getByRole("button", { name: /reset filter/i }).click();

  // Setelah reset, karya kembali tampil.
  await expect(page.getByText(/Concept \/ Internal Experiment/i).first()).toBeVisible();
});

// Kembali ke home dan akses layanan spesifik dari halaman publik.
test("navigasi publik: home → layanan detail", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /lihat karya/i }).first().click();
  await expect(page).toHaveURL(/\/work$/);

  await page.goto("/");
  await page.getByRole("link", { name: /ceritain ide kamu/i }).first().click();
  await expect(page).toHaveURL(/\/contact$/);
});
