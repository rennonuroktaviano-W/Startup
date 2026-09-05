"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertService } from "@/actions/services";
import { ToyButton } from "@/components/ui/button";
import { signalNavigationStart } from "@/components/ui/navigation-indicator";

type Input = {
  id?: string;
  name: string;
  shortDescription: string;
  bodyJson: string;
  priceMode: "BY_SCOPE" | "PRICED";
  isFeatured: boolean;
  status: string;
  metaTitle: string;
  metaDescription: string;
};

export function ServiceForm({ initial }: { initial?: Input }) {
  const router = useRouter();
  const [form, setForm] = useState<Input>({
    name: "",
    shortDescription: "",
    bodyJson: "",
    priceMode: "BY_SCOPE",
    isFeatured: false,
    status: "DRAFT",
    metaTitle: "",
    metaDescription: "",
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setServerError("");
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Nama minimal 2 karakter.";
    if (!form.bodyJson.trim()) errs.bodyJson = "Body wajib.";
    try { JSON.parse(form.bodyJson); } catch { errs.bodyJson = "Body harus JSON valid."; }
    if (Object.keys(errs).length) { setErrors(errs); setLoading(false); return; }
    setErrors({});
    try {
      const res = await upsertService({
        id: initial?.id,
        name: form.name,
        shortDescription: form.shortDescription,
        bodyJson: form.bodyJson,
        priceMode: form.priceMode,
        isFeatured: form.isFeatured,
        status: form.status as "DRAFT" | "PUBLISHED",
        metaTitle: form.metaTitle || form.name,
        metaDescription: form.metaDescription || form.shortDescription,
      });
      if (res.ok) {
        signalNavigationStart();
        router.push("/admin/services");
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{serverError}</p>}
      <Field label="Nama layanan" error={errors.name}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Brand Identity Starter" />
      </Field>
      <Field label="Deskripsi singkat" error={errors.shortDescription}>
        <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputCls} placeholder="Ringkasan singkat…" />
      </Field>
      <Field label="Body (JSON)" error={errors.bodyJson}>
        <textarea value={form.bodyJson} onChange={(e) => setForm({ ...form, bodyJson: e.target.value })} rows={8} className={cn(inputCls, "font-mono text-xs")} placeholder='{"text":"Hello"}' />
      </Field>
      <div className="flex flex-wrap gap-5">
        <Field label="Price Mode">
          <select value={form.priceMode} onChange={(e) => setForm({ ...form, priceMode: e.target.value as Input["priceMode"] })} className={inputCls}>
            <option value="BY_SCOPE">By Scope</option>
            <option value="PRICED">Priced</option>
          </select>
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink/80 pt-6">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 accent-purple" />
          Featured
        </label>
      </div>
      <Field label="Meta Title">
        <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputCls} placeholder="SEO title…" />
      </Field>
      <Field label="Meta Description">
        <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2} className={inputCls} placeholder="SEO desc…" />
      </Field>
      <ToyButton type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {initial?.id ? "Simpan Perubahan" : "Buat Layanan"}
      </ToyButton>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-sm font-semibold text-ink/80">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-danger">{error}</p>}
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-purple";