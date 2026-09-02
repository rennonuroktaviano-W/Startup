import { FaqForm } from "@/components/admin/cms/faq-form";

export const metadata = { title: "Tambah FAQ — Admin" };

export default function NewFaqPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Tambah FAQ Baru</h1>
      <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <FaqForm />
      </div>
    </div>
  );
}