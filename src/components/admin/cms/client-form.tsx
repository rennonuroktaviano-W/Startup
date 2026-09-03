"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { upsertClient } from "@/actions/content";
import { ToyButton } from "@/components/ui/button";
import { FilePicker, type FilePickerValue } from "@/components/admin/cms/file-picker";

export function ClientForm({
  initial,
}: {
  initial?: {
    id: string;
    name: string;
    websiteUrl: string | null;
    isPublic: boolean;
    sortOrder: number;
    logoMediaId: string | null;
    logoUrl: string | null;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    websiteUrl: initial?.websiteUrl ?? "",
    isPublic: initial?.isPublic ?? true,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [logo, setLogo] = useState<FilePickerValue>(
    initial?.logoMediaId ? { id: initial.logoMediaId, url: initial.logoUrl ?? "", name: "logo" } : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await upsertClient({
        id: form.id || undefined,
        name: form.name,
        websiteUrl: form.websiteUrl || undefined,
        isPublic: form.isPublic,
        sortOrder: form.sortOrder,
        logoMediaId: logo?.id ?? undefined,
      });
      router.push("/admin/clients");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {error && <p className="rounded-xl border-2 border-danger bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p>}
      <div className="space-y-4 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <Field label="Nama klien" required>
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Website URL">
          <input className={inputCls} value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://" />
        </Field>
        <Field label="Logo">
          <FilePicker value={logo} onChange={setLogo} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink/80">
          <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="h-5 w-5 accent-purple" />
          Tampilkan ke publik
        </label>
        <div className="flex justify-end">
          <ToyButton onClick={submit} disabled={loading} className="bg-purple text-white">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan
          </ToyButton>
        </div>
      </div>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm focus-visible:outline-3 focus-visible:outline-purple min-w-0";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink/80">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      {children}
    </div>
  );
}
