import { AlertTriangle, CheckCircle2, FileSearch } from "lucide-react";
import type { SeoAuditResult } from "@/lib/seo-audit";

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function SeoAuditPanel({ audit }: { audit: SeoAuditResult }) {
  const hasIssue = audit.slugDuplicates.length > 0 || audit.brokenLinks.length > 0;
  return (
    <div className="mt-6 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <FileSearch className="h-5 w-5 text-purple" /> Pemeriksaan SEO Dasar
        </h2>
        <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold text-ink/60">
          {formatTime(audit.checkedAt)}
        </span>
      </div>

      {!hasIssue ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink/70">
          <CheckCircle2 className="h-4 w-4 text-mint" /> Tidak ditemukan duplikat slug atau tautan internal yang rusak.
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-ink">Duplikat Slug ({audit.slugDuplicates.length})</h3>
            {audit.slugDuplicates.length === 0 ? (
              <p className="mt-1 text-sm text-ink/60">Tidak ada duplikat slug.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {audit.slugDuplicates.map((s) => (
                  <li key={s.slug} className="flex items-center gap-2 text-sm text-ink/75">
                    <AlertTriangle className="h-4 w-4 text-coral" />
                    <code className="rounded bg-ink/5 px-1.5 py-0.5">{s.slug}</code>
                    <span className="text-ink/50">dipakai {s.count}x</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-ink">Tautan Internal Rusak ({audit.brokenLinks.length})</h3>
            {audit.brokenLinks.length === 0 ? (
              <p className="mt-1 text-sm text-ink/60">Tidak ada tautan internal yang rusak.</p>
            ) : (
              <ul className="mt-2 max-h-72 space-y-1 overflow-auto">
                {audit.brokenLinks.map((b) => (
                  <li key={`${b.path}|${b.source}`} className="flex flex-wrap items-center gap-2 text-sm text-ink/75">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-coral" />
                    <code className="rounded bg-ink/5 px-1.5 py-0.5">{b.path}</code>
                    <span className="text-xs text-ink/45">dari {b.source}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
