import { PageForm } from "@/components/admin/cms/page-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Halaman Baru — Admin" };

export default function NewPagePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Halaman baru</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <PageForm />
      </div>
    </div>
  );
}