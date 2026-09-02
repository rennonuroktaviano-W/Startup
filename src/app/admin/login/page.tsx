import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: `Masuk — Admin ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-paper px-5 py-12">
      {/* decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rotate-12 rounded-3xl bg-lemon/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-14 h-56 w-56 -rotate-12 rounded-full bg-sky/30"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-lemon font-display text-xs font-bold">
            KI
          </span>
          {siteConfig.name}
        </Link>
        <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_0_var(--ink)] sm:p-8">
          <p className="toy-sticker -rotate-1 bg-purple text-white">Area Admin</p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Masuk ke dashboard</h1>
          <p className="mt-2 text-sm text-ink/60">
            Halaman ini khusus tim internal. Akun dibuat melalui prosedur seed atau undangan admin.
          </p>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink/50">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </div>
  );
}