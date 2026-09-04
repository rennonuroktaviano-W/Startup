"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Download,
  Grid3X3,
  LayoutList,
  Search,
  Columns3,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LEAD_STATUSES,
  LEAD_STATUS_META,
  LEAD_STATUS_ORDER,
  type LeadStatus,
} from "@/lib/leads";
import { bulkUpdateStatus, markLeadRead } from "@/actions/inquiries";
import { budgetRanges } from "@/lib/content";
import { EmptyState } from "@/components/ui/empty-state";

export type LeadRow = {
  id: string;
  referenceNumber: string;
  name: string;
  companyName: string | null;
  email: string;
  whatsapp: string | null;
  preferredContact: string;
  serviceName: string | null;
  serviceId: string | null;
  goal: string | null;
  budgetRange: string | null;
  status: LeadStatus;
  isRead: boolean;
  assigneeName: string | null;
  assigneeId: string | null;
  createdAt: string;
};

export type LeadQuery = {
  status: string;
  q: string;
  view: "table" | "kanban";
  service: string;
  budget: string;
  assignee: string;
  from: string;
};

export function LeadsManager({
  leads,
  query,
  serviceOptions = [],
  assigneeOptions = [],
}: {
  leads: LeadRow[];
  query: LeadQuery;
  serviceOptions?: { slug: string; name: string }[];
  assigneeOptions?: { id: string; name: string }[];
}) {
  const [view, setView] = useState<"table" | "kanban">(query.view === "kanban" ? "kanban" : "table");
  const [status, setStatus] = useState<string>(query.status || "ALL");
  const [q, setQ] = useState<string>(query.q || "");
  const [service, setService] = useState<string>(query.service || "ALL");
  const [budget, setBudget] = useState<string>(query.budget || "ALL");
  const [assignee, setAssignee] = useState<string>(query.assignee || "ALL");
  const [from, setFrom] = useState<string>(query.from || "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    let list = leads;
    if (status !== "ALL") list = list.filter((l) => l.status === status);
    if (service !== "ALL") list = list.filter((l) => l.serviceId === service);
    if (budget !== "ALL") list = list.filter((l) => l.budgetRange === budget);
    if (assignee !== "ALL") list = list.filter((l) => l.assigneeId === assignee);
    if (from) {
      const fromDate = new Date(from);
      if (!Number.isNaN(fromDate.getTime())) list = list.filter((l) => new Date(l.createdAt) >= fromDate);
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(needle) ||
          (l.companyName ?? "").toLowerCase().includes(needle) ||
          l.email.toLowerCase().includes(needle) ||
          l.referenceNumber.toLowerCase().includes(needle),
      );
    }
    return list;
  }, [leads, status, q, service, budget, assignee, from]);

  const applyFilter = (patch: Partial<{ status: string; q: string; service: string; budget: string; assignee: string; from: string }>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const sp = new URLSearchParams();
      const next = {
        status: patch.status ?? status,
        q: patch.q ?? q,
        service: patch.service ?? service,
        budget: patch.budget ?? budget,
        assignee: patch.assignee ?? assignee,
        from: patch.from ?? from,
      };
      if (next.status && next.status !== "ALL") sp.set("status", next.status);
      if (next.q.trim()) sp.set("q", next.q.trim());
      if (next.service && next.service !== "ALL") sp.set("service", next.service);
      if (next.budget && next.budget !== "ALL") sp.set("budget", next.budget);
      if (next.assignee && next.assignee !== "ALL") sp.set("assignee", next.assignee);
      if (next.from) sp.set("from", next.from);
      sp.set("view", view);
      window.location.search = sp.toString();
    }, 400);
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((l) => l.id));
    });

  const handleMarkRead = async (id: string, isRead: boolean) => {
    setBusy(true);
    await markLeadRead(id, isRead);
    setBusy(false);
    window.location.reload();
  };

  const handleBulk = async (next: LeadStatus) => {
    if (!selected.size) return;
    setBusy(true);
    await bulkUpdateStatus(Array.from(selected), next);
    setBusy(false);
    setSelected(new Set());
    window.location.reload();
  };

  const exportQuery = `?status=${status}&q=${encodeURIComponent(q)}&service=${service}&budget=${budget}&assignee=${assignee}${from ? `&from=${encodeURIComponent(from)}` : ""}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-ink bg-surface p-3 shadow-[3px_3px_0_0_var(--ink)]">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              applyFilter({ q: e.target.value });
            }}
            placeholder="Cari nama, email, referensi…"
            className="h-10 w-full rounded-xl border-2 border-ink bg-white pl-9 pr-3 text-sm focus-visible:outline-3 focus-visible:outline-purple"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            applyFilter({ status: e.target.value });
          }}
          aria-label="Filter status"
          className="h-10 rounded-xl border-2 border-ink bg-white px-3 text-sm"
        >
          <option value="ALL">Semua status</option>
          {LEAD_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_META[s].label}
            </option>
          ))}
        </select>
        <select
          value={service}
          onChange={(e) => {
            setService(e.target.value);
            applyFilter({ service: e.target.value });
          }}
          aria-label="Filter layanan"
          className="h-10 rounded-xl border-2 border-ink bg-white px-3 text-sm"
        >
          <option value="ALL">Semua layanan</option>
          {serviceOptions.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            applyFilter({ budget: e.target.value });
          }}
          aria-label="Filter budget"
          className="h-10 rounded-xl border-2 border-ink bg-white px-3 text-sm"
        >
          <option value="ALL">Semua budget</option>
          {budgetRanges.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        <select
          value={assignee}
          onChange={(e) => {
            setAssignee(e.target.value);
            applyFilter({ assignee: e.target.value });
          }}
          aria-label="Filter penanggung jawab"
          className="h-10 rounded-xl border-2 border-ink bg-white px-3 text-sm"
        >
          <option value="ALL">Semua penanggung jawab</option>
          {assigneeOptions.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-ink/60">
          Dari
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              applyFilter({ from: e.target.value });
            }}
            aria-label="Filter dari tanggal"
            className="h-10 rounded-xl border-2 border-ink bg-white px-2 text-sm text-ink"
          />
        </label>
        <div className="flex overflow-hidden rounded-full border-2 border-ink">
          <button
            type="button"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            className={cn("flex h-9 w-10 items-center justify-center", view === "table" ? "bg-purple text-white" : "bg-surface")}
            aria-label="Tampilan tabel"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("kanban")}
            aria-pressed={view === "kanban"}
            className={cn("flex h-9 w-10 items-center justify-center border-l-2 border-ink", view === "kanban" ? "bg-purple text-white" : "bg-surface")}
            aria-label="Tampilan kanban"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
        </div>
        <a
          href={`/api/leads/export${exportQuery}`}
          className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-ink bg-lemon px-4 text-sm font-bold shadow-[2px_2px_0_0_var(--ink)]"
        >
          <Download className="h-4 w-4" /> Ekspor CSV
        </a>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-ink bg-purple/10 p-3">
          <span className="text-sm font-bold text-ink">{selected.size} dipilih</span>
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => handleBulk(s)}
              className="rounded-full border-2 border-ink bg-surface px-3 py-1 text-xs font-semibold disabled:opacity-50"
            >
              {LEAD_STATUS_META[s].label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Columns3 className="h-6 w-6" />}
          title="Tidak ada prospek"
          description="Belum ada project brief masuk, atau coba ubah filter pencarian."
        />
      ) : view === "table" ? (
        /* ---- TABLE ---- */
        <div className="overflow-x-auto rounded-2xl border-2 border-ink bg-surface shadow-[3px_3px_0_0_var(--ink)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink bg-paper/60 text-xs uppercase tracking-wide text-ink/50">
                <th className="w-8 px-3 py-3">
                  <input type="checkbox" onChange={toggleAll} checked={selected.size === filtered.length && filtered.length > 0} aria-label="Pilih semua" />
                </th>
                <th className="px-3 py-3">Prospek</th>
                <th className="px-3 py-3">Layanan</th>
                <th className="px-3 py-3">Budget</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">PIC</th>
                <th className="px-3 py-3">Tanggal</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-dashed border-ink/10 last:border-0 hover:bg-paper/50">
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleSelect(l.id)} aria-label={`Pilih ${l.referenceNumber}`} />
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/leads/${l.id}`} className="block">
                      <p className="flex items-center gap-1.5 font-bold text-ink">
                        {!l.isRead && <span className="h-2 w-2 rounded-full bg-coral" aria-label="Belum dibaca" />}
                        {l.name}
                      </p>
                      <p className="text-xs text-ink/55">{l.companyName ?? l.referenceNumber}</p>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-ink/75">{l.serviceName ?? "—"}</td>
                  <td className="px-3 py-3 text-ink/75">{l.budgetRange ?? "—"}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-3 py-3 text-ink/75">{l.assigneeName ?? "—"}</td>
                  <td className="px-3 py-3 text-xs text-ink/60">{formatRelative(l.createdAt)}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleMarkRead(l.id, !l.isRead)}
                      title={l.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-surface hover:bg-sky"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ---- KANBAN ---- */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {LEAD_STATUS_ORDER.map((s) => {
            const col = filtered.filter((l) => l.status === s);
            return (
              <div key={s} className="w-64 shrink-0 rounded-2xl border-2 border-ink bg-surface/70 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className={cn("flex h-2.5 w-2.5 rounded-full", LEAD_STATUS_META[s].dot)} />
                  <p className="text-sm font-bold text-ink">{LEAD_STATUS_META[s].label}</p>
                  <span className="rounded-full border-2 border-ink bg-white px-2 text-xs font-bold">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((l) => (
                    <Link
                      key={l.id}
                      href={`/admin/leads/${l.id}`}
                      className="block rounded-xl border-2 border-ink bg-surface p-3 shadow-[2px_2px_0_0_var(--ink)] hover:-translate-y-0.5 transition-transform"
                    >
                      <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                        {!l.isRead && <span className="h-2 w-2 rounded-full bg-coral" />}
                        {l.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/55">{l.companyName ?? l.email}</p>
                      <p className="mt-1 text-xs text-ink/60">{l.serviceName ?? "—"}</p>
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-ink/45">
                        <span>{l.referenceNumber}</span> · <span>{formatRelative(l.createdAt)}</span>
                      </p>
                    </Link>
                  ))}
                  {col.length === 0 && (
                    <p className="rounded-xl border-2 border-dashed border-ink/15 p-3 text-center text-xs text-ink/40">Kosong</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = LEAD_STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-2 py-0.5 text-[11px] font-bold", meta.tone)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

function formatRelative(value: string): string {
  const d = new Date(value);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(d);
}
