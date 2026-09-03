"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertPageSection, deletePageSection, reorderSections } from "@/actions/pages";

interface Section {
  id: string;
  sectionType: string;
  variant: string;
  contentJson: unknown;
  sortOrder: number;
  isVisible: boolean;
}

const SECTION_TYPES = ["hero", "text", "grid", "cta", "faq", "split", "gallery"] as const;
const VARIANTS = ["default", "accent", "muted", "bordered"] as const;

function toPlain(obj: unknown): string {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export function SectionManager({ pageId, sections }: { pageId: string; sections: Section[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{ id?: string; sectionType: string; variant: string; contentJson: string; isVisible: boolean }>({
    sectionType: "text",
    variant: "default",
    contentJson: "",
    isVisible: true,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    let parsed = {};
    if (draft.contentJson.trim()) {
      try {
        parsed = JSON.parse(draft.contentJson);
      } catch {
        parsed = draft.contentJson;
      }
    }
    const res = await upsertPageSection({
      id: draft.id,
      pageId,
      sectionType: draft.sectionType as never,
      variant: draft.variant,
      contentJson: JSON.stringify(parsed),
      isVisible: draft.isVisible,
    });
    setLoading(false);
    if (!res.ok) {
      setError("Gagal menyimpan bagian.");
      return;
    }
    setDraft({ sectionType: "text", variant: "default", contentJson: "", isVisible: true });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Hapus bagian ini?")) return;
    await deletePageSection(id);
    router.refresh();
  }

  async function reorder() {
    await reorderSections(pageId, sections.map((s) => s.id));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}

      {/* Daftar bagian */}
      {sections.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-ink/20 p-5 text-center text-sm text-ink/60">Belum ada bagian. Tambahkan dengan formulir di bawah.</p>
      ) : (
        <ul className="space-y-2">
          {sections.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-ink bg-white px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">
                  {s.sectionType}
                  <span className="ml-2 rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold text-ink/60">{s.variant}</span>
                  {!s.isVisible && <span className="ml-2 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">tersembunyi</span>}
                </p>
                <p className="truncate text-xs text-ink/50">Urutan {s.sortOrder}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ id: s.id, sectionType: s.sectionType, variant: s.variant, contentJson: toPlain(s.contentJson), isVisible: s.isVisible })
                  }
                  className="rounded-lg border-2 border-ink px-3 py-1 text-xs font-bold text-ink"
                >
                  Edit
                </button>
                <button type="button" onClick={() => remove(s.id)} className="rounded-lg border-2 border-danger px-3 py-1 text-xs font-bold text-danger">
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Form tambah/edit */}
      <form onSubmit={save} className="space-y-4 rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
        <p className="text-sm font-bold text-ink">{draft.id ? "Edit bagian" : "Tambah bagian"}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Jenis bagian</label>
            <select
              value={draft.sectionType}
              onChange={(e) => setDraft({ ...draft, sectionType: e.target.value })}
              className="h-10 w-full rounded-xl border-2 border-ink bg-white px-3 text-sm"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink/70">Varian</label>
            <select
              value={draft.variant}
              onChange={(e) => setDraft({ ...draft, variant: e.target.value })}
              className="h-10 w-full rounded-xl border-2 border-ink bg-white px-3 text-sm"
            >
              {VARIANTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink/70">Konten (JSON)</label>
          <textarea
            value={draft.contentJson}
            onChange={(e) => setDraft({ ...draft, contentJson: e.target.value })}
            placeholder='{"heading":"...","body":"..."}'
            className="h-32 w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-mono text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input type="checkbox" className="h-4 w-4 accent-purple" checked={draft.isVisible} onChange={(e) => setDraft({ ...draft, isVisible: e.target.checked })} />
          Tampilkan di publik
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={loading} className="rounded-xl border-2 border-ink bg-purple px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "Menyimpan..." : draft.id ? "Simpan peribahan" : "Tambah"}
          </button>
          {draft.id && (
            <button
              type="button"
              onClick={() => setDraft({ sectionType: "text", variant: "default", contentJson: "", isVisible: true })}
              className="rounded-xl border-2 border-ink px-4 py-2 text-sm font-bold text-ink"
            >
              Batal
            </button>
          )}
          {sections.length > 1 && (
            <button type="button" onClick={reorder} className="rounded-xl border-2 border-ink px-4 py-2 text-sm font-bold text-ink">
              Urutkan ulang
            </button>
          )}
        </div>
      </form>
    </div>
  );
}