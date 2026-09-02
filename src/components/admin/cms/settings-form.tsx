"use client";

import { useState } from "react";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { upsertSettingsBulk } from "@/actions/settings";
import { ToyButton } from "@/components/ui/button";

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [entries, setEntries] = useState<{ key: string; value: string }[]>(() =>
    Object.entries(initial).map(([key, value]) => ({ key, value }))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const add = () => setEntries((e) => [...e, { key: "", value: "" }]);

  const update = (i: number, patch: Partial<{ key: string; value: string }>) => {
    setEntries((e) => e.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  };

  const remove = (i: number) => setEntries((e) => e.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    const map = Object.fromEntries(entries.filter((e) => e.key.trim()).map((e) => [e.key.trim(), e.value]));
    try {
      await upsertSettingsBulk(map);
      setMessage("Tersimpan.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              value={entry.key}
              onChange={(e) => update(i, { key: e.target.value })}
              placeholder="key"
              className="h-10 w-48 shrink-0 rounded-xl border-2 border-ink bg-white px-3 font-mono text-xs"
            />
            <input
              value={entry.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder="value"
              className="h-10 min-w-0 flex-1 rounded-xl border-2 border-ink bg-white px-3 text-sm"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-surface hover:bg-coral/10"
              aria-label="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-4 py-2 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah baris
        </button>
        <ToyButton onClick={handleSave} disabled={loading} className="bg-purple text-white">
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan
        </ToyButton>
        {message && <span className="text-xs font-semibold text-ink/70">{message}</span>}
      </div>
    </div>
  );
}