"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CheckCheck,
  Mail,
  MessageCircle,
  Paperclip,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LEAD_STATUS_ORDER,
  LEAD_STATUS_META,
  type LeadStatus,
} from "@/lib/leads";
import {
  addInquiryNote,
  archiveLead,
  assignLead,
  deleteInquiryNote,
  markLeadRead,
  setLeadStatus,
  togglePinNote,
} from "@/actions/inquiries";
import { ToyButton } from "@/components/ui/button";
import { whatsappLink, siteConfig } from "@/lib/site";

export type LeadDetailProps = {
  lead: {
    id: string;
    referenceNumber: string;
    name: string;
    companyName: string | null;
    email: string;
    whatsapp: string | null;
    preferredContact: string;
    serviceName: string | null;
    goal: string | null;
    description: string | null;
    features: string[];
    referenceUrl: string | null;
    targetDate: string | null;
    assets: string[];
    budgetRange: string | null;
    status: LeadStatus;
    isRead: boolean;
    assigneeId: string | null;
    lostReason: string | null;
    source: string | null;
    consentAt: string;
    createdAt: string;
    archivedAt: string | null;
    lastContactedAt: string | null;
  };
  notes: {
    id: string;
    body: string;
    isPinned: boolean;
    authorName: string | null;
    createdAt: string;
  }[];
  activities: { id: string; action: string; actorName: string | null; createdAt: string }[];
  team: { id: string; name: string }[];
  attachments: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    createdAt: string;
    url: string;
  }[];
};

export function LeadDetail({ lead, notes, activities, team, attachments }: LeadDetailProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);
  const [assignee, setAssignee] = useState<string | null>(lead.assigneeId);
  const [isRead, setIsRead] = useState(lead.isRead);
  const [noteBody, setNoteBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [lostReason, setLostReason] = useState(lead.lostReason ?? "");

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
      router.refresh();
    }
  };

  const changeStatus = async (next: LeadStatus) => {
    setBusy(true);
    await setLeadStatus(lead.id, next, lostReason);
    setBusy(false);
    setCurrentStatus(next);
    router.refresh();
  };

  const changeAssignee = async (next: string | null) => {
    setBusy(true);
    await assignLead(lead.id, next);
    setBusy(false);
    setAssignee(next);
    router.refresh();
  };

  const toggleRead = async () => {
    setBusy(true);
    await markLeadRead(lead.id, !isRead);
    setBusy(false);
    setIsRead(!isRead);
    router.refresh();
  };

  const submitNote = async () => {
    const body = noteBody.trim();
    if (!body) return;
    setBusy(true);
    await addInquiryNote({ inquiryId: lead.id, body });
    setBusy(false);
    setNoteBody("");
    router.refresh();
  };

  const waText = `Halo ${lead.name}, saya dari ${siteConfig.name}. Terima kasih sudah mengirim project brief (${lead.referenceNumber}) — kami ingin menindaklanjuti.`;

  return (
    <div className="space-y-5">
      <LinkBack href="/admin/leads" />

      {/* Header */}
      <div className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-semibold text-ink">{lead.name}</h1>
              {!isRead && <span className="rounded-full border-2 border-ink bg-coral px-2 py-0.5 text-[10px] font-bold">BARU</span>}
            </div>
            <p className="mt-1 text-sm text-ink/60">
              {lead.companyName ?? "—"} · {lead.referenceNumber}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ToyButton onClick={toggleRead} variant="secondary" disabled={busy}>
              <CheckCheck className="h-4 w-4" />
              {isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
            </ToyButton>
            {lead.archivedAt ? (
              <ToyButton
                variant="secondary"
                disabled={busy}
                onClick={() => run(() => archiveLead(lead.id, false))}
              >
                <ArchiveRestore className="h-4 w-4" /> Pulihkan
              </ToyButton>
            ) : (
              <ToyButton
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  if (confirm("Arsipkan prospek ini?")) run(() => archiveLead(lead.id, true));
                }}
              >
                <Archive className="h-4 w-4" /> Arsipkan
              </ToyButton>
            )}
          </div>
        </div>

        {/* Status pipeline */}
        <div className="mt-5 flex flex-wrap gap-2">
          {LEAD_STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => changeStatus(s)}
              className={cn(
                "rounded-full border-2 border-ink px-3 py-1.5 text-xs font-bold transition-colors",
                currentStatus === s ? LEAD_STATUS_META[s].tone : "bg-paper text-ink/60 hover:bg-ink/5",
              )}
            >
              {LEAD_STATUS_META[s].label}
            </button>
          ))}
        </div>
        {currentStatus === "LOST" && (
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-ink/60">Alasan kalah</label>
            <div className="flex gap-2">
              <input
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                placeholder="Alasan prospek tidak lanjut…"
                className="h-10 flex-1 rounded-xl border-2 border-ink bg-white px-3 text-sm"
              />
              <button
                type="button"
                onClick={() => changeStatus("LOST")}
                disabled={busy}
                className="rounded-xl border-2 border-ink bg-coral px-3 text-sm font-bold"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick contact */}
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-0.5 transition-transform"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-sky">
            <Mail className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Email</p>
            <p className="truncate text-sm font-semibold text-ink">{lead.email}</p>
          </div>
        </a>
        <a
          href={whatsappLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)] hover:-translate-y-0.5 transition-transform"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-mint">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-ink/50">WhatsApp</p>
            <p className="truncate text-sm font-semibold text-ink">{lead.whatsapp ?? "Tidak diisi"}</p>
          </div>
          <span className="ml-auto text-xs font-bold text-mint">Buka chat</span>
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Detail */}
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <h2 className="font-display text-lg font-semibold text-ink">Detail Brief</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <Row label="Referensi" value={lead.referenceNumber} />
              <Row label="Nama bisnis" value={lead.companyName ?? "—"} />
              <Row label="Layanan" value={lead.serviceName ?? "—"} />
              <Row label="Tujuan utama" value={lead.goal ?? "—"} />
              <Row label="Kontak pilihan" value={lead.preferredContact} />
              <Row label="Budget" value={lead.budgetRange ?? "—"} />
              <Row label="Target waktu" value={lead.targetDate ?? "—"} />
              <Row label="Sumber" value={lead.source ?? "website"} />
            </dl>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Deskripsi proyek</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{lead.description}</p>
            </div>
            {lead.features.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Fitur dibutuhkan</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {lead.features.map((f) => (
                    <span key={f} className="rounded-full border-2 border-ink bg-lemon px-2 py-0.5 text-xs font-semibold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {lead.assets.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Aset dimiliki</p>
                <p className="mt-1 text-sm text-ink/75">{lead.assets.join(", ")}</p>
              </div>
            )}
            {lead.referenceUrl && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Referensi URL</p>
                <a href={lead.referenceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-semibold text-purple underline underline-offset-4">
                  {lead.referenceUrl}
                </a>
              </div>
            )}
            {attachments.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Lampiran</p>
                <ul className="mt-1.5 space-y-1.5">
                  {attachments.map((a) => (
                    <li key={a.id}>
                      <a
                        href={a.url}
                        className="flex items-center justify-between gap-3 rounded-lg border-2 border-ink/20 bg-paper px-3 py-2 text-sm hover:border-purple"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Paperclip className="h-4 w-4 shrink-0 text-purple" />
                          <span className="truncate font-semibold text-ink">{a.originalName}</span>
                        </span>
                        <span className="shrink-0 text-xs text-ink/55">
                          {(a.sizeBytes / 1024).toFixed(0)} KB · {formatDate(a.createdAt)} · Unduh
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-4 border-t-2 border-dashed border-ink/15 pt-3 text-xs text-ink/50">
              Diterima {formatDateTime(lead.createdAt)} · Disetujui privasi {formatDate(lead.consentAt)}
              {lead.lastContactedAt ? ` · Kontak terakhir ${formatDate(lead.lastContactedAt)}` : ""}
            </p>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Paperclip className="h-5 w-5 text-purple" /> Catatan Internal
            </h2>
            <div className="mt-4">
              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={3}
                placeholder="Catat hasil diskusi, kesepakatan, atau follow-up…"
                className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2.5 text-sm focus-visible:outline-3 focus-visible:outline-purple"
              />
              <div className="mt-2 flex justify-end">
                <ToyButton onClick={submitNote} size="sm" disabled={busy || !noteBody.trim()}>
                  Tambah Catatan
                </ToyButton>
              </div>
            </div>
            {notes.length === 0 ? (
              <p className="mt-4 rounded-xl border-2 border-dashed border-ink/20 p-4 text-sm text-ink/60">Belum ada catatan.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {notes
                  .slice()
                  .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
                  .map((n) => (
                    <li key={n.id} className={cn("rounded-xl border-2 p-3", n.isPinned ? "border-ink bg-lemon/40" : "border-ink/15 bg-paper")}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-ink/55">
                          {n.authorName ?? "Admin"} · {formatDateTime(n.createdAt)}
                        </p>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => run(() => togglePinNote(n.id, !n.isPinned))}
                            title={n.isPinned ? "Lepas pin" : "Pin"}
                            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-surface"
                          >
                            {n.isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Hapus catatan ini?")) run(() => deleteInquiryNote(n.id));
                            }}
                            title="Hapus"
                            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-surface hover:bg-coral/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink/85">{n.body}</p>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <section className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <h2 className="font-display text-lg font-semibold text-ink">Penanganan</h2>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-ink/50">Penanggung jawab</label>
            <select
              value={assignee ?? ""}
              onChange={(e) => changeAssignee(e.target.value || null)}
              disabled={busy}
              className="mt-1.5 h-10 w-full rounded-xl border-2 border-ink bg-white px-3 text-sm"
            >
              <option value="">Belum ditunjuk</option>
              {team.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
            <h2 className="font-display text-lg font-semibold text-ink">Aktivitas</h2>
            {activities.length === 0 ? (
              <p className="mt-3 text-sm text-ink/60">Belum ada aktivitas.</p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {activities.map((a) => (
                  <li key={a.id} className="flex gap-2 text-sm">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple" />
                    <div>
                      <p className="text-ink/80">
                        {ACTIVITY_LABEL[a.action] ?? a.action}
                        <span className="block text-xs text-ink/50">
                          {a.actorName ?? "Sistem"} · {formatDateTime(a.createdAt)}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_LABEL: Record<string, string> = {
  brief_submitted: "Project brief dikirim",
  status_change: "Status diubah",
  assign: "Ditugaskan ke staf",
  note_added: "Catatan ditambahkan",
  bulk_status: "Status massal",
  archive: "Diarsipkan",
  restore: "Dipulihkan",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink/85">{value}</dd>
    </div>
  );
}

function LinkBack({ href }: { href: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
      <ArrowLeft className="h-4 w-4" /> Kembali ke Prospek
    </a>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
