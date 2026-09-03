"use client";

import { useState } from "react";
import { generatePreviewLink } from "@/actions/revisions";
import { Link2 } from "lucide-react";

export function PreviewLink({
  entityType,
  entityId,
}: {
  entityType: "BlogPost" | "Project" | "Service";
  entityId: string;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    const res = await generatePreviewLink(entityType, entityId);
    setLoading(false);
    if (!res.ok) {
      setError("Gagal membuat tautan pratinjau.");
      return;
    }
    setUrl(res.url);
  }

  function handleCopy() {
    void navigator.clipboard?.writeText(url);
  }

  return (
    <div className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Pratinjau konten</p>
      <p className="mt-2 text-sm text-ink/70">
        Buat tautan pratinjau sementara (kedaluwarsa 24 jam) untuk melihat {entityType === "Project" ? "proyek" : entityType === "BlogPost" ? "artikel" : "layanan"} sebelum dipublikasikan.
      </p>
      {error && <p role="alert" className="mt-3 rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-purple px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Link2 className="h-4 w-4" />
          {loading ? "Membuat..." : "Buat tautan pratinjau"}
        </button>
        {url && (
          <>
            <code className="max-w-full truncate rounded-lg border border-ink/20 bg-white px-3 py-2 text-xs text-ink/70">{url}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl border-2 border-ink px-4 py-2.5 text-sm font-semibold text-ink"
            >
              Salin
            </button>
          </>
        )}
      </div>
    </div>
  );
}