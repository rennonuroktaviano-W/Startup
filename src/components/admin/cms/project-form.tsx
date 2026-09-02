"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertProject } from "@/actions/projects";
import { ToyButton } from "@/components/ui/button";

type Input = {
  id?: string;
  title: string;
  projectType: string;
  industry: string;
  year: string;
  summary: string;
  challengeJson: string;
  goalsJson: string;
  approachJson: string;
  outcomeJson: string;
  isFeatured: boolean;
  status: string;
  serviceIds: string[];
  clientId: string;
};

export function ProjectForm({
  initial,
  services,
  clients,
}: {
  initial?: Partial<Input>;
  services: { id: string; name: string }[];
  clients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Input>({
    title: "",
    projectType: "CONCEPT",
    industry: "",
    year: "",
    summary: "",
    challengeJson: "[]",
    goalsJson: "[]",
    approachJson: "[]",
    outcomeJson: "[]",
    isFeatured: false,
    status: "DRAFT",
    
    serviceIds: [],
    clientId: "",
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleService = (id: string) => {
    setForm((f) => ({ ...f, serviceIds: f.serviceIds.includes(id) ? f.serviceIds.filter((x) => x !== id) : [...f.serviceIds, id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setServerError("");
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 2) errs.title = "Judul minimal 2 karakter.";
    for (const k of ["challengeJson", "goalsJson", "approachJson", "outcomeJson"] as const) {
      if (form[k].trim()) { try { JSON.parse(form[k]); } catch { errs[k] = "Harus JSON array valid."; } }
    }
    if (Object.keys(errs).length) { setErrors(errs); setLoading(false); return; }
    setErrors({});
    try {
      const res = await upsertProject({
        id: initial?.id,
        title: form.title,
        projectType: form.projectType as "CONCEPT" | "CLIENT",
        clientId: form.clientId || undefined,
        industry: form.industry || undefined,
        year: form.year ? +form.year : undefined,
        summary: form.summary || undefined,
        challengeJson: form.challengeJson,
        goalsJson: form.goalsJson,
        approachJson: form.approachJson,
        outcomeJson: form.outcomeJson,
        isFeatured: form.isFeatured,
        status: form.status as "DRAFT" | "PUBLISHED",
        serviceIds: form.serviceIds.length ? form.serviceIds : undefined,
      });
      if (res.ok) router.push("/admin/projects");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{serverError}</p>}
      <Field label="Judul proyek" error={errors.title}>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Contoh: E-Commerce Skincare" />
      </Field>
      <div className="flex gap-5">
        <Field label="Tipe proyek">
          <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className={inputCls}>
            <option value="CONCEPT">Concept</option>
            <option value="CLIENT">Client</option>
          </select>
        </Field>
        <Field label="Industri">
          <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className={inputCls} placeholder="Fashion, F&B, SaaS…" />
        </Field>
        <Field label="Tahun">
          <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputCls} placeholder="2025" />
        </Field>
      </div>
      {clients.length > 0 && (
        <Field label="Klien">
          <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className={inputCls}>
            <option value="">— Tanpa klien —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      )}
      <Field label="Ringkasan" error={errors.summary}>
        <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} className={inputCls} placeholder="Deskripsi singkat…" />
      </Field>
      {services.length > 0 && (
        <Field label="Layanan terkait">
          <div className="flex flex-wrap gap-3">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-1.5 text-sm text-ink/80">
                <input type="checkbox" checked={form.serviceIds.includes(s.id)} onChange={() => toggleService(s.id)} className="h-4 w-4 accent-purple" />
                {s.name}
              </label>
            ))}
          </div>
        </Field>
      )}
      <JsonArea label="Challenge (JSON)" value={form.challengeJson} error={errors.challengeJson} onChange={(v) => setForm({ ...form, challengeJson: v })} />
      <JsonArea label="Goals (JSON)" value={form.goalsJson} error={errors.goalsJson} onChange={(v) => setForm({ ...form, goalsJson: v })} />
      <JsonArea label="Approach (JSON)" value={form.approachJson} error={errors.approachJson} onChange={(v) => setForm({ ...form, approachJson: v })} />
      <JsonArea label="Outcome (JSON)" value={form.outcomeJson} error={errors.outcomeJson} onChange={(v) => setForm({ ...form, outcomeJson: v })} />
      <div className="flex flex-wrap gap-5">
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm font-semibold text-ink/80">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="h-4 w-4 accent-purple" />
          Featured
        </label>
      </div>
      <ToyButton type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {initial?.id ? "Simpan Perubahan" : "Buat Proyek"}
      </ToyButton>
    </form>
  );
}

function JsonArea({ label, value, error, onChange }: { label: string; value: string; error?: string; onChange: (v: string) => void }) {
  return (
    <Field label={label} error={error}>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} className={cn(inputCls, "font-mono text-xs")} placeholder="[]" />
    </Field>
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
