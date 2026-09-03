"use client";

import { useState } from "react";
import { upsertSettingsBulk } from "@/actions/settings";

const COLOR_FIELDS: { key: string; label: string; fallback: string }[] = [
  { key: "theme.ink", label: "Warna teks utama", fallback: "#17132b" },
  { key: "theme.paper", label: "Latar halaman", fallback: "#fff9f3" },
  { key: "theme.purple", label: "Aksen ungu", fallback: "#7357ff" },
  { key: "theme.lemon", label: "Aksen kuning", fallback: "#ffd84d" },
  { key: "theme.coral", label: "Aksen koral", fallback: "#ff6b72" },
  { key: "theme.sky", label: "Aksen biru", fallback: "#62d8ff" },
  { key: "theme.mint", label: "Aksen hijau", fallback: "#66e2a6" },
  { key: "theme.surface", label: "Permukaan kartu", fallback: "#ffffff" },
  { key: "theme.danger", label: "Warna bahaya", fallback: "#d9364f" },
];

const INTENSITY_STEPS = ["calm", "playful", "extra"] as const;

export function ThemeForm({ initial }: { initial: Record<string, string> }) {
  const [colors, setColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(COLOR_FIELDS.map((f) => [f.key, initial[f.key] ?? f.fallback]))
  );
  const [intensity, setIntensity] = useState<string>(
    INTENSITY_STEPS.includes(initial["theme.intensity"] as (typeof INTENSITY_STEPS)[number])
      ? initial["theme.intensity"]
      : "playful",
  );
  const [decorations, setDecorations] = useState<boolean>(initial["theme.decorations"] !== "off");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await upsertSettingsBulk({
        ...colors,
        "theme.intensity": intensity,
        "theme.decorations": decorations ? "on" : "off",
      });
      setMessage("Tema tersimpan. Perubahan muncul di seluruh situs.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tema.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      {message && <p className="rounded-xl border-2 border-mint bg-mint/10 px-4 py-3 text-sm font-semibold text-ink">{message}</p>}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Warna</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLOR_FIELDS.map((f) => (
            <label key={f.key} className="flex items-center gap-3 rounded-xl border-2 border-ink bg-white p-3">
              <input
                type="color"
                value={colors[f.key]}
                onChange={(e) => setColors({ ...colors, [f.key]: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded-lg border-2 border-ink bg-white"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{f.label}</p>
                <p className="truncate font-mono text-xs text-ink/50">{colors[f.key]}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">Intensitas gerakan</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {INTENSITY_STEPS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setIntensity(s)}
              className={`rounded-xl border-2 border-ink p-4 text-left text-sm font-semibold shadow-[2px_2px_0_0_var(--ink)] ${
                intensity === s ? "bg-purple text-white" : "bg-surface text-ink"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink/50">Kalem = animasi lembut & jarang · Level ekstra = lebih banyak pergerakan.</p>
      </section>

      <label className="flex items-center gap-3 rounded-xl border-2 border-ink bg-surface p-4 text-sm font-semibold text-ink">
        <input type="checkbox" className="h-4 w-4 accent-purple" checked={decorations} onChange={(e) => setDecorations(e.target.checked)} />
        Tampilkan dekorasi (tekstur/latar hiasan)
      </label>

      <button type="submit" disabled={loading} className="rounded-xl border-2 border-ink bg-purple px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
        {loading ? "Menyimpan..." : "Simpan Tema"}
      </button>
    </form>
  );
}