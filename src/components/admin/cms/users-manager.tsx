"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, LogOut, Plus, UserPlus, Copy } from "lucide-react";
import { createAdmin, forceLogout, setUserStatus, updateUserRole } from "@/actions/users";
import { ToyButton } from "@/components/ui/button";

type Role = "SUPER_ADMIN" | "CONTENT_EDITOR" | "SALES";

export type UsersManagerProps = {
  users: {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: "ACTIVE" | "INACTIVE";
    lastLoginAt: string | null;
    createdAt: string;
  }[];
};

export function UsersManager({ users }: UsersManagerProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("CONTENT_EDITOR");
  const [created, setCreated] = useState<{ email: string; tempPassword: string } | null>(null);
  const [creating, setCreating] = useState(false);

  const run = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await fn();
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    const res = await createAdmin({ name: newName, email: newEmail, role: newRole });
    setCreating(false);
    if (res.ok) {
      setCreated({ email: newEmail, tempPassword: res.tempPassword });
      setNewName("");
      setNewEmail("");
      setNewRole("CONTENT_EDITOR");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ToyButton variant="lemon" onClick={() => setShowCreate((v) => !v)}>
          <UserPlus className="h-4 w-4" /> Tambah Admin
        </ToyButton>
      </div>

      {showCreate && (
        <div className="rounded-2xl border-2 border-ink bg-surface p-5 shadow-[3px_3px_0_0_var(--ink)]">
          <h3 className="font-display text-lg font-semibold text-ink">Buat akun admin</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama" className={inputCls} />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" type="email" className={inputCls} />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value as Role)} className={inputCls}>
              <option value="CONTENT_EDITOR">Editor Konten</option>
              <option value="SALES">Sales</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end">
            <ToyButton onClick={handleCreate} disabled={creating || !newName || !newEmail} className="bg-purple text-white">
              {creating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Buat
            </ToyButton>
          </div>
          {created && (
            <div className="mt-4 rounded-xl border-2 border-ink bg-lemon/40 p-4 text-sm">
              <p className="font-bold text-ink">Akun berhasil dibuat — salin password sekali ini (tidak akan tampil lagi).</p>
              <p className="mt-2 text-ink">Email: <strong>{created.email}</strong></p>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-ink">{created.tempPassword}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(created.tempPassword)}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-surface px-2 py-1 text-xs font-bold"
                >
                  <Copy className="h-3 w-3" /> Salin
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-[3px_3px_0_0_var(--ink)]">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                {u.name}
                <span className={`rounded-full border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold ${u.status === "ACTIVE" ? "bg-mint" : "bg-ink/20 text-ink/50"}`}>
                  {u.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                </span>
              </p>
              <p className="truncate text-xs text-ink/55">{u.email}</p>
              <p className="text-xs text-ink/45">
                Terakhir login: {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "belum pernah"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={u.role}
                disabled={busyId === u.id}
                onChange={(e) => run(u.id, () => updateUserRole({ id: u.id, role: e.target.value as Role }))}
                className="h-9 rounded-xl border-2 border-ink bg-white px-2 text-xs font-semibold"
                aria-label={`Peran ${u.name}`}
              >
                <option value="CONTENT_EDITOR">Editor Konten</option>
                <option value="SALES">Sales</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <button
                type="button"
                disabled={busyId === u.id}
                onClick={() => run(u.id, () => setUserStatus(u.id, u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"))}
                className="rounded-full border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold disabled:opacity-50"
              >
                {u.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button
                type="button"
                disabled={busyId === u.id}
                title="Force logout semua sesi"
                onClick={() => run(u.id, () => forceLogout(u.id))}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-surface hover:bg-coral/10"
              >
                {busyId === u.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm focus-visible:outline-3 focus-visible:outline-purple min-w-0";

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
