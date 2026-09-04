"use client";

import { useState } from "react";
import { LoaderCircle, Mail, Plus, Save, Trash2 } from "lucide-react";
import { deleteNotification, upsertNotification } from "@/actions/notifications";
import { NOTIFICATION_EVENTS, type NotificationSettingRow } from "@/features/notifications/meta";
import { ToyButton } from "@/components/ui/button";

export function NotificationForm({ initial }: { initial: NotificationSettingRow[] }) {
  const [rows, setRows] = useState<NotificationSettingRow[]>(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const add = () => {
    const used = new Set(rows.map((r) => r.eventKey));
    const next = NOTIFICATION_EVENTS.find((e) => !used.has(e.key));
    if (!next) {
      setMessage("Semua event sudah ditambahkan.");
      return;
    }
    setRows((r) => [
      ...r,
      { id: "", eventKey: next.key, recipients: [], channel: "email", isEnabled: true },
    ]);
    setMessage("");
  };

  const update = (id: string, patch: Partial<NotificationSettingRow>) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const recipientsChanged = (row: NotificationSettingRow, value: string) => {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    update(row.id, { recipients: parts });
  };

  const save = async (row: NotificationSettingRow) => {
    setLoadingId(row.id || row.eventKey);
    setMessage("");
    try {
      const res = await upsertNotification({
        id: row.id || undefined,
        eventKey: row.eventKey,
        recipients: row.recipients,
        channel: row.channel,
        isEnabled: row.isEnabled,
      });
      if (res.ok) {
        setMessage("Tersimpan.");
      }
    } catch {
      setMessage("Gagal menyimpan.");
    } finally {
      setLoadingId(null);
    }
  };

  const remove = async (row: NotificationSettingRow) => {
    setLoadingId(row.id);
    setMessage("");
    try {
      if (row.id) {
        await deleteNotification(row.id);
      }
      setRows((r) => r.filter((x) => x.id !== row.id));
    } catch {
      setMessage("Gagal menghapus.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/70">
        Atur ke siapa notifikasi email dikirim untuk tiap peristiwa. Kosongkan penerima berarti memakai kembali fallback dari environment bila tersedia.
      </p>

      <div className="space-y-4">
        {rows.map((row) => {
          const meta = NOTIFICATION_EVENTS.find((e) => e.key === row.eventKey);
          return (
            <div key={row.id || row.eventKey} className="rounded-xl border-2 border-ink bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-semibold text-ink">{meta?.label ?? row.eventKey}</p>
                  {meta && <p className="text-xs text-ink/60">{meta.description}</p>}
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold text-ink/70">
                  <input
                    type="checkbox"
                    checked={row.isEnabled}
                    onChange={(e) => update(row.id, { isEnabled: e.target.checked })}
                    className="h-4 w-4 accent-purple"
                  />
                  Aktif
                </label>
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-ink/70">
                  <Mail className="h-3.5 w-3.5" /> Penerima
                </label>
                <input
                  value={row.recipients.join(", ")}
                  onChange={(e) => recipientsChanged(row, e.target.value)}
                  placeholder="admin@domain.com, sales@domain.com"
                  className="h-10 min-w-0 flex-1 rounded-xl border-2 border-ink bg-white px-3 text-sm"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ToyButton onClick={() => save(row)} disabled={!!loadingId} className="bg-purple text-white">
                  {loadingId === (row.id || row.eventKey) ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan
                </ToyButton>
                <button
                  type="button"
                  onClick={() => remove(row)}
                  disabled={!!loadingId}
                  className="flex h-10 items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-4 text-sm font-semibold hover:bg-danger/10"
                >
                  <Trash2 className="h-4 w-4" /> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-4 py-2 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" /> Tambah event
        </button>
        {message && <span className="text-xs font-semibold text-ink/70">{message}</span>}
      </div>
    </div>
  );
}
