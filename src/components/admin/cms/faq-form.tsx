"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertFaq } from "@/actions/content";
import { ToyButton } from "@/components/ui/button";

type Input = {
  id?: string;
  question: string;
  answerJson: string;
  category: string;
  sortOrder: number;
  status: string;
};

const CATEGORIES = ["GENERAL", "PROCESS", "PRICING", "SERVICE"];

export function FaqForm({ initial }: { initial?: Input }) {
  const router = useRouter();
  const [form, setForm] = useState<Input>({
    question: "",
    answerJson: "",
    category: "GENERAL",
    sortOrder: 0,
    status: "PUBLISHED",
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
    if (form.question.trim().length < 2) errs.question = "Pertanyaan minimal 2 karakter.";
    if (!form.answerJson.trim()) errs.answerJson = "Jawaban wajib.";
    else { try { JSON.parse(form.answerJson); } catch { errs.answerJson = "Jawaban harus JSON valid."; } }
    if (Object.keys(errs).length) { setErrors(errs); setLoading(false); return; }
    setErrors({});
    try {
      const res = await upsertFaq({
        id: initial?.id,
        question: form.question,
        answerJson: form.answerJson,
        category: form.category as "GENERAL" | "PROCESS" | "PRICING" | "SERVICE",
        sortOrder: form.sortOrder,
        status: form.status as "DRAFT" | "PUBLISHED",
      });
      if (res.ok) router.push("/admin/faqs");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{serverError}</p>}
      <Field label="Pertanyaan" error={errors.question}>
        <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputCls} placeholder="Apa itu KotakIde?" />
      </Field>
      <Field label="Jawaban (JSON)" error={errors.answerJson}>
        <textarea value={form.answerJson} onChange={(e) => setForm({ ...form, answerJson: e.target.value })} rows={5} className={cn(inputCls, "font-mono text-xs")} placeholder='"KotakIde adalah..."' />
      </Field>
      <div className="flex gap-5">
        <Field label="Kategori">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Urutan">
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })} className={inputCls} />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </Field>
      </div>
      <ToyButton type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {initial?.id ? "Simpan Perubahan" : "Buat FAQ"}
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