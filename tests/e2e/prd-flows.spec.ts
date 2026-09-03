import { test, expect, type Page } from "@playwright/test";

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL ?? "admin@kotakide.test";
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

const uniq = () => Math.random().toString(36).slice(2, 8).toUpperCase();

async function submitBrief(page: Page) {
  await page.goto("/contact");
  await expect(page).toHaveURL(/\/contact$/);

  // Langkah 1 — Tentang Anda
  await page.locator("#field-name").fill(`Pengujian ${uniq()}`);
  await page.locator("#field-email").fill(`e2e-${uniq()}@example.com`);
  await page.locator("#field-whatsapp").fill("081234567890");
  await page.getByRole("button", { name: /lanjut/i }).click();

  // Langkah 2 — Proyek
  await page.locator("#field-description").fill("Project brief otomatis untuk memverifikasi alur pipeline dari sesi e2e ini.");
  await page.getByRole("button", { name: /lanjut/i }).click();

  // Langkah 3 — Scope
  await page.locator("#field-referenceUrl").fill("https://example.com");
  await page.getByRole("button", { name: /lanjut/i }).click();

  // Langkah 4 — Budget & Konfirmasi (harness butuh >= 4 detik dari mulai)
  await page.locator("#field-budgetRange").selectOption({ index: 1 });
  await page.waitForTimeout(4500);
  await page.getByText(/Saya setuju informasi/).click();
  await page.getByRole("button", { name: /kirim brief/i }).click();

  await expect(page.getByText("Brief terkirim!")).toBeVisible({ timeout: 15_000 });
  const ref = (await page.getByText(/KI-\d{4}-[A-Z0-9]{6}/).first().textContent())?.trim() ?? "";
  expect(ref).toMatch(/^KI-\d{4}-[A-Z0-9]{6}$/);
  return ref;
}

async function adminLogin(page: Page) {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.locator("#login-email").fill(ADMIN_EMAIL);
  await page.locator("#login-password").fill(ADMIN_PASSWORD as string);
  await page.getByRole("button", { name: /masuk/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
}

test.describe.configure({ mode: "serial" });

test("§33.3 alur lengkap: brief → prospek di admin → konsep project dipublikasi", async ({ page }) => {
  test.skip(!ADMIN_PASSWORD, "INITIAL_ADMIN_PASSWORD belum diset untuk e2e.");

  // 1) Publik: submit project brief.
  const reference = await submitBrief(page);
  expect(reference).toBeTruthy();

  // 2) Admin: login.
  await adminLogin(page);

  // 3) Admin: temukan prospek baru berdasarkan nomor referensi.
  await page.getByRole("link", { name: /prospek/i }).first().click();
  await expect(page).toHaveURL(/\/admin\/leads$/);
  await page.locator('input[placeholder*="Cari"]').fill(reference);
  await expect(page.getByText(reference).first()).toBeVisible();
  await page.getByText(reference).first().click();
  await expect(page).toHaveURL(/\/admin\/leads\/[a-z0-9]+/);
  await expect(page.getByRole("heading", { name: /Pengujian/ })).toBeVisible();

  // 4) Admin: tambah catatan internal.
  const noteInput = page.getByPlaceholder(/Catat hasil diskusi/);
  await expect(noteInput).toBeVisible();
  await noteInput.fill("Catatan dari sesi e2e.");
  await expect(noteInput).toHaveValue("Catatan dari sesi e2e.");
  await page.getByRole("button", { name: /tambah catatan/i }).click();
  await expect(page.getByText("Catatan dari sesi e2e.")).toBeVisible();

  // 5) Admin: buat proyek konsep lalu publikasikan.
  const conceptTitle = `Konsep e2e ${uniq()}`;
  await page.goto("/admin/projects/new");
  await page.getByPlaceholder(/E-Commerce Skincare/).fill(conceptTitle);
  await page.getByPlaceholder(/Fashion, F/).fill("SaaS");
  const jsonAreas = page.locator('textarea[placeholder="[]"]');
  for (let i = 0; i < 4; i++) {
    await jsonAreas.nth(i).fill(JSON.stringify(["poin"]));
  }
  // Tipe proyek: Concept (default) — status: Published.
  await page.locator("label", { hasText: /^Status$/ }).locator("..").locator("select").selectOption("PUBLISHED");
  await page.getByRole("button", { name: /buat proyek/i }).click();
  await expect(page).toHaveURL(/\/admin\/projects$/, { timeout: 15_000 });

  // 6) Publik: proyek konsep tampil di /work.
  await page.goto("/work");
  await expect(page.getByRole("link", { name: new RegExp(conceptTitle) }).first()).toBeVisible();
});

test("§33.3 logout → rute admin tetap terlindungi", async ({ page }) => {
  test.skip(!ADMIN_PASSWORD, "INITIAL_ADMIN_PASSWORD belum diset untuk e2e.");
  await adminLogin(page);

  // Logout (menu aksi pengguna di shell admin).
  await page.getByRole("button", { name: /keluar|logout/i }).first().click();
  await expect(page).toHaveURL(/\/admin\/login$/, { timeout: 15_000 });

  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login$/);
});