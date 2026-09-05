"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertBlogPost } from "@/actions/content";
import { ToyButton } from "@/components/ui/button";
import { signalNavigationStart } from "@/components/ui/navigation-indicator";

type Input = {
  id?: string;
  title: string;
  excerpt: string;
  bodyJson: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  categoryIds: string[];
  tagIds: string[];
};

export function BlogPostForm({
  initial,
  categories,
  tags,
}: {
  initial?: Input;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Input>({
    title: "",
    excerpt: "",
    bodyJson: "",
    status: "DRAFT",
    metaTitle: "",
    metaDescription: "",
    categoryIds: [],
    tagIds: [],
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleArrayField = (field: "categoryIds" | "tagIds", id: string) => {
    setForm((f) => {
      const arr = f[field];
      return { ...f, [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setServerError("");
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 2) errs.title = "Judul minimal 2 karakter.";
    if (!form.bodyJson.trim()) errs.bodyJson = "Body wajib.";
    else { try { JSON.parse(form.bodyJson); } catch { errs.bodyJson = "Body harus JSON valid."; } }
    if (Object.keys(errs).length) { setErrors(errs); setLoading(false); return; }
    setErrors({});
    try {
      const res = await upsertBlogPost({
        id: initial?.id,
        title: form.title,
        excerpt: form.excerpt,
        bodyJson: form.bodyJson,
        status: form.status as "DRAFT" | "PUBLISHED",
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.excerpt,
        categoryIds: form.categoryIds.length ? form.categoryIds : undefined,
        tagIds: form.tagIds.length ? form.tagIds : undefined,
      });
      if (res.ok) {
        signalNavigationStart();
        router.push("/admin/blog");
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
      <Field label="Judul" error={errors.title}>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Judul artikel…" />
      </Field>
      <Field label="Excerpt" error={errors.excerpt}>
        <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className={inputCls} placeholder="Ringkasan singkat…" />
      </Field>
      <Field label="Body (JSON)" error={errors.bodyJson}>
        <textarea value={form.bodyJson} onChange={(e) => setForm({ ...form, bodyJson: e.target.value })} rows={10} className={cn(inputCls, "font-mono text-xs")} placeholder='[{"type":"paragraph","text":"Hello"}]' />
      </Field>
      <div className="flex gap-5">
        <Field label="Status">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </Field>
      </div>
      {categories.length > 0 && (
        <Field label="Kategori">
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-1.5 text-sm text-ink/80">
                <input type="checkbox" checked={form.categoryIds.includes(c.id)} onChange={() => toggleArrayField("categoryIds", c.id)} className="h-4 w-4 accent-purple" />
                {c.name}
              </label>
            ))}
          </div>
        </Field>
      )}
      {tags.length > 0 && (
        <Field label="Tags">
          <div className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <label key={t.id} className="flex items-center gap-1.5 text-sm text-ink/80">
                <input type="checkbox" checked={form.tagIds.includes(t.id)} onChange={() => toggleArrayField("tagIds", t.id)} className="h-4 w-4 accent-purple" />
                {t.name}
              </label>
            ))}
          </div>
        </Field>
      )}
      <Field label="Meta Title">
        <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className={inputCls} placeholder="SEO title…" />
      </Field>
      <Field label="Meta Description">
        <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={2} className={inputCls} placeholder="SEO desc…" />
      </Field>
      <ToyButton type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {initial?.id ? "Simpan Perubahan" : "Buat Artikel"}
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