"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

export function BackupClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/admin/backups/export", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal mengekspor (status " + res.status + ").");
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : `kotakide-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengekspor data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      <p className="text-sm text-ink/70">Unduh salinan seluruh konten utama sebagai file JSON.</p>
      <button
        type="button"
        onClick={download}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-purple px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {loading ? "Mengekspor..." : "Unduh backup JSON"}
      </button>
    </div>
  );
}