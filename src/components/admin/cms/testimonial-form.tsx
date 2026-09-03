"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { upsertTestimonial } from "@/actions/content";
import { ToyButton } from "@/components/ui/button";
import { FilePicker, type FilePickerValue } from "@/components/admin/cms/file-picker";

export function TestimonialForm({
  initial,
}: {
  initial?: {
    id: string;
    personName: string;
    jobTitle: string | null;
    companyName: string | null;
    quote: string;
    consentStatus: string;
    status: string;
    sortOrder: number;
    avatarMediaId: string | null;
    avatarUrl: string | null;
  };
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    id: initial?.id ?? "",
    personName: initial?.personName ?? "",
    jobTitle: initial?.jobTitle ?? "",
    companyName: initial?.companyName ?? "",
    quote: initial?.quote ?? "",
    status: initial?.status ?? "PENDING_PERMISSION",
    consentStatus: initial?.consentStatus ?? "PENDING_PERMISSION",
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [avatar, setAvatar] = useState<FilePickerValue>(
    initial?.avatarMediaId ? { id: initial.avatarMediaId, url: initial.avatarUrl ?? "", name: "avatar" } : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await upsertTestimonial({
        id: form.id || undefined,
        personName: form.personName,
        jobTitle: form.jobTitle,
        companyName: form.companyName,
        quote: form.quote,
        status: form.status as never,
        consentStatus: form.consentStatus as never,
        sortOrder: form.sortOrder,
        avatarMediaId: avatar?.id ?? undefined,
      });
      router.push("/admin/testimonials");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {error && <p className="rounded-xl border-2 border-danger bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p>}
      <div className="space-y-4 rounded-2xl border-2 border-ink bg-surface p-6 shadow-[3px_3px_0_0_var(--ink)]">
        <Field label="Nama orang" required>
          <input className={inputCls} value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Jabatan">
            <input className={inputCls} value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
          </Field>
          <Field label="Perusahaan">
            <input className={inputCls} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </Field>
        </div>
        <Field label="Kutipan" required>
          <textarea className={cn(inputCls, "h-28 py-2.5")} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="PENDING_PERMISSION">Menunggu izin</option>
              <option value="PUBLISHED">Published</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </Field>
          <Field label="Izin publikasi">
            <select className={inputCls} value={form.consentStatus} onChange={(e) => setForm({ ...form, consentStatus: e.target.value })}>
              <option value="PENDING_PERMISSION">Menunggu</option>
              <option value="APPROVED">Disetujui</option>
              <option value="DENIED">Ditolak</option>
            </select>
          </Field>
        </div>
        <Field label="Avatar / Logo">
          <FilePicker value={avatar} onChange={setAvatar} />
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
