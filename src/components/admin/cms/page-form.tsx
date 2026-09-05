"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertPage } from "@/actions/pages";
import { signalNavigationStart } from "@/components/ui/navigation-indicator";

interface FormState {
  title: string;
  slug: string;
  pageType: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
}

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-purple";

export function PageForm({ initial }: { initial?: Partial<FormState> & { id?: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    pageType: initial?.pageType ?? "GENERIC",
    status: initial?.status ?? "DRAFT",
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    canonicalUrl: initial?.canonicalUrl ?? "",
    noIndex: initial?.noIndex ?? false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) {
      setError("Slug hanya boleh huruf kecil, angka, dan tanda minus.");
      setLoading(false);
      return;
    }
    const res = await upsertPage({
      id: initial?.id,
      title: form.title,
      slug: form.slug,
      pageType: form.pageType as never,
      status: form.status as never,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      canonicalUrl: form.canonicalUrl || null,
      noIndex: form.noIndex,
    });
    setLoading(false);
    if (!res.ok) {
      setError("Gagal menyimpan halaman.");
      return;
    }
    if (!initial?.id) {
      signalNavigationStart();
      router.push(`/admin/pages/${res.id}/edit`);
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Judul</label>
        <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Judul halaman" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Slug</label>
        <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="tentang-kami" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Tipe halaman</label>
          <select className={inputCls} value={form.pageType} onChange={(e) => set("pageType", e.target.value)}>
            {["GENERIC", "HOME", "SERVICES", "WORK", "ABOUT", "PROCESS", "INSIGHTS", "CONTACT", "LEGAL"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Status</label>
          <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
            {["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">SEO Meta Title</label>
        <input className={inputCls} value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Meta title" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">SEO Meta Description</label>
        <textarea className={`${inputCls} h-24 py-3`} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Meta description" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Canonical URL</label>
        <input className={inputCls} value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} placeholder="https://..." />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-ink">
        <input type="checkbox" className="h-4 w-4 accent-purple" checked={form.noIndex} onChange={(e) => set("noIndex", e.target.checked)} />
        Jangan diindeks (noindex)
      </label>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border-2 border-ink bg-purple px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        {initial?.id && form.status === "PUBLISHED" && (
          <a href={`/pages/${form.slug}`} target="_blank" rel="noreferrer" className="rounded-xl border-2 border-ink px-5 py-2.5 text-sm font-bold text-ink">
            Lihat publik
          </a>
        )}
      </div>
    </form>
  );
}