"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertSettingsBulk } from "@/actions/settings";
import { upsertRedirect, toggleRedirect, deleteRedirect } from "@/actions/redirects";

interface SavedRedirect {
  id: string;
  sourcePath: string;
  destinationUrl: string;
  statusCode: number;
  isActive: boolean;
}

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-purple";

export function SeoForm({ initial, redirects }: { initial: Record<string, string>; redirects: SavedRedirect[] }) {
  const router = useRouter();
  const [seo, setSeo] = useState({
    seoTitle: initial["seo.title"] ?? "",
    seoDescription: initial["seo.description"] ?? "",
    seoOgImage: initial["seo.og_image"] ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newRedirect, setNewRedirect] = useState({ sourcePath: "", destinationUrl: "", statusCode: 301 as 301 | 302 });

  async function saveSeo(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await upsertSettingsBulk({
        "seo.title": seo.seoTitle,
        "seo.description": seo.seoDescription,
        "seo.og_image": seo.seoOgImage,
      });
      setMessage("Pengaturan SEO tersimpan.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  }

  async function addRedirect(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!newRedirect.sourcePath.startsWith("/")) {
      setError("Path sumber harus diawali '/'. Contoh: /halaman-lama");
      return;
    }
    setLoading(true);
    const res = await upsertRedirect({
      sourcePath: newRedirect.sourcePath,
      destinationUrl: newRedirect.destinationUrl,
      statusCode: newRedirect.statusCode,
      isActive: true,
    });
    setLoading(false);
    if (!res.ok) {
      setError("Gagal menyimpan redirect.");
      return;
    }
    setNewRedirect({ sourcePath: "", destinationUrl: "", statusCode: 301 });
    router.refresh();
  }

  async function toggle(r: SavedRedirect) {
    await toggleRedirect(r.id, !r.isActive);
    router.refresh();
  }

  async function remove(r: SavedRedirect) {
    if (!confirm(`Hapus redirect ${r.sourcePath}?`)) return;
    await deleteRedirect(r.id);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Global SEO */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">SEO global</h2>
        <form onSubmit={saveSeo} className="space-y-4">
          {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Judul default (beranda)</label>
            <input className={inputCls} value={seo.seoTitle} onChange={(e) => setSeo({ ...seo, seoTitle: e.target.value })} placeholder="Nama — Studio Website" />
            <p className="mt-1 text-xs text-ink/50">Kosongkan untuk memakai nilai bawaan.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Deskripsi default</label>
            <textarea className={`${inputCls} h-24 py-3`} value={seo.seoDescription} onChange={(e) => setSeo({ ...seo, seoDescription: e.target.value })} placeholder="Deskripsi meta default" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Gambar OG (Open Graph)</label>
            <input className={inputCls} value={seo.seoOgImage} onChange={(e) => setSeo({ ...seo, seoOgImage: e.target.value })} placeholder="/brand/og-default.png" />
          </div>
          <button type="submit" disabled={loading} className="rounded-xl border-2 border-ink bg-purple px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan SEO"}
          </button>
          {message && <span className="ml-3 text-sm font-semibold text-ink/70">{message}</span>}
        </form>
      </section>

      {/* Redirects */}
      <section>
        <h2 className="mb-1 font-display text-lg font-semibold text-ink">Redirect</h2>
        <p className="mb-3 text-sm text-ink/60">Arahkan ulang URL lama ke URL baru (301 sementara). Dipakai mis. saat slug konten berubah.</p>

        <form onSubmit={addRedirect} className="space-y-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[2px_2px_0_0_var(--ink)] sm:flex sm:items-end sm:gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-ink/70">Path lama</label>
            <input className={`${inputCls} h-10`} value={newRedirect.sourcePath} onChange={(e) => setNewRedirect({ ...newRedirect, sourcePath: e.target.value })} placeholder="/halaman-lama" required />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-ink/70">Tujuan</label>
            <input className={`${inputCls} h-10`} value={newRedirect.destinationUrl} onChange={(e) => setNewRedirect({ ...newRedirect, destinationUrl: e.target.value })} placeholder="/halaman-baru atau https://..." required />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Status</label>
            <select className={`${inputCls} h-10`} value={newRedirect.statusCode} onChange={(e) => setNewRedirect({ ...newRedirect, statusCode: Number(e.target.value) as 301 | 302 })}>
              <option value={301}>301 Permanen</option>
              <option value={302}>302 Sementara</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="h-10 rounded-xl border-2 border-ink bg-purple px-4 text-sm font-bold text-white disabled:opacity-60">
            Tambah
          </button>
        </form>

        {redirects.length === 0 ? (
          <p className="mt-4 rounded-xl border-2 border-dashed border-ink/20 p-5 text-center text-sm text-ink/60">Belum ada redirect.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {redirects.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-ink bg-white px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {r.sourcePath} <span className="text-ink/40">→</span> {r.destinationUrl}
                  </p>
                  <p className="text-xs text-ink/50">
                    {r.statusCode} · {r.isActive ? "aktif" : "nonaktif"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggle(r)} className="rounded-lg border-2 border-ink px-3 py-1 text-xs font-bold text-ink">
                    {r.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button type="button" onClick={() => remove(r)} className="rounded-lg border-2 border-danger px-3 py-1 text-xs font-bold text-danger">
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}