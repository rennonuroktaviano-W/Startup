"use client";

import { useState } from "react";
import { LoaderCircle, Plus, Trash2, GripVertical, ArrowUp, ArrowDown, Save, Eye, EyeOff } from "lucide-react";
import { reorderNavigation, upsertNavigationItem, deleteNavigationItem } from "@/actions/navigation";
import { ToyButton } from "@/components/ui/button";

type NavItem = { id: string; label: string; href: string; type: "INTERNAL" | "EXTERNAL"; isCta: boolean; isVisible: boolean; desktopOrder: number };

export function NavEditor({ initial }: { initial: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("/");

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setItems(copy.map((it, i) => ({ ...it, desktopOrder: i })));
  };

  const update = (i: number, patch: Partial<NavItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const addNew = async () => {
    if (!newLabel.trim() || !newHref.trim()) return;
    const res = await upsertNavigationItem({ label: newLabel, href: newHref, desktopOrder: items.length });
    if (res.ok) {
      setItems((prev) => [...prev, { id: res.id!, label: newLabel, href: newHref, type: newHref.startsWith("http") ? "EXTERNAL" : "INTERNAL", isCta: false, isVisible: true, desktopOrder: items.length }]);
      setNewLabel("");
      setNewHref("/");
    }
  };

  const saveOrder = async () => {
    setLoading(true);
    setMessage("");
    try {
      await reorderNavigation(items.map((it) => it.id));
      setMessage("Urutan tersimpan.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (item: NavItem) => {
    if (!confirm(`Hapus "${item.label}"?`)) return;
    await deleteNavigationItem(item.id);
    setItems((prev) => prev.filter((it) => it.id !== item.id));
  };

  return (
    <div className="space-y-5">
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-ink bg-white p-3">
            <GripVertical className="h-4 w-4 text-ink/25" />
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg border border-ink bg-surface p-1 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded-lg border border-ink bg-surface p-1 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
            <input value={item.label} onChange={(e) => update(i, { label: e.target.value })} className="h-9 w-36 rounded-lg border-2 border-ink px-2 text-sm font-semibold" />
            <input value={item.href} onChange={(e) => update(i, { href: e.target.value })} className="h-9 min-w-0 flex-1 rounded-lg border-2 border-ink px-2 font-mono text-xs" />
            <select value={item.type} onChange={(e) => update(i, { type: e.target.value as NavItem["type"] })} className="h-9 rounded-lg border-2 border-ink bg-surface px-1 text-xs">
              <option value="INTERNAL">Internal</option>
              <option value="EXTERNAL">External</option>
            </select>
            <button
              type="button"
              onClick={() => update(i, { isVisible: !item.isVisible })}
              aria-label={item.isVisible ? "Sembunyikan" : "Tampilkan"}
              className={`rounded-lg border-2 p-1 ${item.isVisible ? "border-ink bg-surface" : "border-dashed opacity-50"}`}
            >
              {item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => remove(item)} className="rounded-lg border-2 border-ink bg-surface p-1 hover:bg-coral/10"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>

      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-semibold text-ink/60">Label baru</label>
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="h-10 w-full rounded-xl border-2 border-ink bg-white px-3 text-sm" placeholder="Produk" />
        </div>
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-semibold text-ink/60">Href</label>
          <input value={newHref} onChange={(e) => setNewHref(e.target.value)} className="h-10 w-full rounded-xl border-2 border-ink bg-white px-3 font-mono text-xs" placeholder="/services" />
        </div>
        <button type="button" onClick={addNew} className="flex h-10 items-center gap-1.5 rounded-xl border-2 border-ink bg-lemon px-3 text-xs font-semibold"><Plus className="h-3.5 w-3.5" /> Tambah</button>
      </div>

      <div className="flex items-center gap-3">
        <ToyButton onClick={saveOrder} disabled={loading} className="bg-purple text-white">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Urutan
        </ToyButton>
        {message && <span className="text-xs font-semibold text-ink/70">{message}</span>}
      </div>
    </div>
  );
}