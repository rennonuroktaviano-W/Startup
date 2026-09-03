"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertTeamMember } from "@/actions/content";
import { ToyButton } from "@/components/ui/button";
import { FilePicker, type FilePickerValue } from "@/components/admin/cms/file-picker";

export function TeamMemberForm({
  initial,
}: {
  initial?: {
    id: string;
    name: string;
    roleTitle: string;
    bio: string | null;
    status: string;
    sortOrder: number;
    photoMediaId: string | null;
    photoUrl: string | null;
    socialJson: unknown;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    roleTitle: initial?.roleTitle ?? "",
    bio: initial?.bio ?? "",
    status: initial?.status ?? "ACTIVE",
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [photo, setPhoto] = useState<FilePickerValue>(
    initial?.photoMediaId ? { id: initial.photoMediaId, url: initial.photoUrl ?? "", name: "foto" } : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await upsertTeamMember({
        id: form.id || undefined,
        name: form.name,
        roleTitle: form.roleTitle,
        bio: form.bio,
        status: form.status as never,
        sortOrder: form.sortOrder,
        photoMediaId: photo?.id ?? undefined,
      });
      router.push("/admin/team");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {error && <p className="rounded-xl border-2 border-danger bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p>}
      <div className="space-y-4 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <Field label="Nama" required>
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Peran / jabatan" required>
          <input className={inputCls} value={form.roleTitle} onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} />
        </Field>
        <Field label="Bio">
          <textarea className={cn(inputCls, "h-28 py-2.5")} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </Field>
        <Field label="Foto">
          <FilePicker value={photo} onChange={setPhoto} />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Nonaktif</option>
          </select>
        </Field>
        <div className="flex justify-end">
          <ToyButton onClick={submit} disabled={loading} className="bg-purple text-white">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan
          </ToyButton>
        </div>
      </div>
    </div>
  );
}

const inputCls = "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm focus-visible:outline-3 focus-visible:outline-purple min-w-0";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink/80">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      {children}
    </div>
  );
}
