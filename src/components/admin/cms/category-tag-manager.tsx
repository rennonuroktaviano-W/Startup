"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertBlogCategory, deleteBlogCategory, upsertBlogTag, deleteBlogTag } from "@/actions/content";

interface Item {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  usage: number;
}

const inputCls =
  "h-10 w-full rounded-xl border-2 border-ink bg-white px-3 text-sm text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-purple";

export function CategoryTagManager({ kind, items }: { kind: "category" | "tag"; items: Item[] }) {
  const router = useRouter();
  const isCategory = kind === "category";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = isCategory
      ? await upsertBlogCategory({ id: editId ?? undefined, name, description: description || undefined })
      : await upsertBlogTag({ id: editId ?? undefined, name });
    setLoading(false);
    if (!res.ok) {
      setError("Gagal menyimpan.");
      return;
    }
    setName("");
    setDescription("");
    setEditId(null);
    router.refresh();
  }

  async function remove(item: Item) {
    if (!confirm(`Hapus ${isCategory ? "kategori" : "tag"} "${item.name}"?`)) return;
    const res = isCategory ? await deleteBlogCategory(item.id) : await deleteBlogTag(item.id);
    if (!res.ok) {
      setError(res.error ?? "Gagal menghapus.");
      return;
    }
    router.refresh();
  }

  function startEdit(item: Item) {
    setEditId(item.id);
    setName(item.name);
    setDescription(item.description ?? "");
  }

  return (
    <div className="space-y-5">
      {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}

      <form onSubmit={save} className="space-y-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[2px_2px_0_0_var(--ink)]">
        <p className="text-sm font-bold text-ink">{editId ? "Edit" : "Tambah"} {isCategory ? "kategori" : "tag"}</p>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink/70">Nama</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Cerita Klien" required />
        </div>
        {isCategory && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Deskripsi</label>
            <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opsional" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="rounded-xl border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "Menyimpan..." : editId ? "Simpan perubahan" : "Tambah"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setName(""); setDescription(""); }} className="rounded-xl border-2 border-ink px-4 py-2 text-sm font-bold text-ink">
              Batal
            </button>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-ink/20 p-5 text-center text-sm text-ink/60">Belum ada {isCategory ? "kategori" : "tag"}.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-ink bg-white px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">{item.name}</p>
                <p className="truncate text-xs text-ink/50">
                  /{item.slug} · dipakai {item.usage} artikel
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => startEdit(item)} className="rounded-lg border-2 border-ink px-3 py-1 text-xs font-bold text-ink">
                  Edit
                </button>
                <button type="button" onClick={() => remove(item)} className="rounded-lg border-2 border-danger px-3 py-1 text-xs font-bold text-danger">
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}