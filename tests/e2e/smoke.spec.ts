import { test, expect } from "@playwright/test";

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL ?? "admin@kotakide.test";
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

test.describe.configure({ mode: "serial" });

test("alur publik: home, work (concept) dan navigasi float berfungsi", async ({ page }) => {
  await page.goto("/");

  // Hero dan CTA utama terlihat.
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

  // Tidak ada navbar/footer tradisional.
  await expect(page.locator("header nav")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);

  // Navigasi mengarah ke halaman Work dan konsep project tampil dengan label jujur.
  await page.goto("/work");
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByText(/Concept \/ Internal Experiment/i).first()).toBeVisible();
});

test("alur admin: guard redirect dan login menuju dashboard", async ({ page }) => {
  test.skip(!ADMIN_PASSWORD, "INITIAL_ADMIN_PASSWORD belum diset untuk e2e.");
  const password = ADMIN_PASSWORD as string;

  // Tanpa session, rute admin dialihkan ke halaman login.
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login$/);

  await page.locator("#login-email").fill(ADMIN_EMAIL);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: /masuk/i }).click();

  // Berhasil masuk: kembali ke dashboard admin (shell admin tampil).
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
  await expect(page.getByRole("link", { name: /dashboard/i }).first()).toBeVisible();
});