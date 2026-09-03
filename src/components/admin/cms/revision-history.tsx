"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreRevision } from "@/actions/revisions";

interface PostedRevision {
  id: string;
  versionNumber: number;
  createdAt: string | Date;
  author?: { name: string | null; email: string | null } | null;
}

export function RevisionHistory({
  revisions,
}: {
  revisions: PostedRevision[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleRestore(id: string) {
    if (!confirm("Kembalikan konten ke versi ini? Perubahan terbaru akan diganti.")) return;
    setBusyId(id);
    setError("");
    const res = await restoreRevision(id);
    setBusyId(null);
    if (!res.ok) {
      setError(res.error ?? "Gagal memulihkan revisi.");
      return;
    }
    router.refresh();
  }

  if (revisions.length === 0) {
    return <p className="text-sm text-ink/50">Belum ada revisi tersimpan untuk konten ini.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Riwayat revisi</p>
      {error && <p role="alert" className="rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}
      <ul className="space-y-2">
        {revisions.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-surface px-4 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">v{r.versionNumber}</p>
              <p className="truncate text-xs text-ink/50">
                {new Date(r.createdAt).toLocaleString()}
                {r.author?.name ? ` — ${r.author.name}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRestore(r.id)}
              disabled={busyId === r.id}
              className="shrink-0 rounded-lg border-2 border-ink bg-purple px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyId === r.id ? "Memulihkan..." : "Kembalikan"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}