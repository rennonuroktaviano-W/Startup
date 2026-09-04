"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { whatsappLink, siteConfig } from "@/lib/site";
import { servicesList, budgetRanges, responseTimeText } from "@/lib/content";
import { submitInquiry, type SubmitInquiryResult } from "@/actions/inquiries";
import { useAnalytics } from "@/components/analytics/analytics-provider";
import { ToyButton } from "@/components/ui/button";
import { AttachmentUpload, type AttachmentDescriptor } from "@/components/forms/attachment-upload";

const preferredContacts = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Telepon" },
  { value: "OTHER", label: "Lainnya" },
];

const goals = [
  "Menambah kredibilitas & info perusahaan",
  "Meningkatkan penjualan / lead",
  "Mempermudah operasional tim",
  "Membuat aplikasi kustom",
  "Lainnya",
];

const assetOptions = ["Desain", "Domain", "Hosting", "Konten (teks/foto)"];

const featureOptions = [
  "Formulir kontak",
  "Galeri",
  "Blog/berita",
  "Pembayaran",
  "Login pengguna",
  "Dashboard admin",
  "WhatsApp chat",
  "Laporan / analitik",
  "Multi-bahasa",
  "Integrasi sosial media",
];

const targetDates = ["Segera / ASAP", "1–2 minggu", "1 bulan", "2–3 bulan", "Belum tentu"];

const stepLabels = ["Tentang Anda", "Proyek", "Scope", "Budget & Konfirmasi"];

type FormState = {
  name: string;
  companyName: string;
  email: string;
  whatsapp: string;
  preferredContact: string;
  serviceSlug: string;
  goal: string;
  description: string;
  features: string[];
  assets: string[];
  referenceUrl: string;
  targetDate: string;
  budgetRange: string;
  consent: boolean;
  attachments: AttachmentDescriptor[];
};

const emptyForm: FormState = {
  name: "",
  companyName: "",
  email: "",
  whatsapp: "",
  preferredContact: "WHATSAPP",
  serviceSlug: "",
  goal: "",
  description: "",
  features: [],
  assets: [],
  referenceUrl: "",
  targetDate: "",
  budgetRange: "",
  consent: false,
  attachments: [],
};

export function ProjectBriefForm({
  prefillType = "",
  whatsapp,
  responseTime,
}: {
  prefillType?: string;
  whatsapp?: string;
  responseTime?: string;
}) {
  const chatNumber = whatsapp ?? siteConfig.whatsapp;
  const responseCopy = responseTime ?? responseTimeText;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    serviceSlug:
      servicesList.some((s) => s.slug === prefillType) ? prefillType : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<SubmitInquiryResult | null>(null);
  const [serverMessage, setServerMessage] = useState("");
  const startedAt = useRef<number | null>(null);
  const submissionKey = useRef<string>(
    crypto.randomUUID ? crypto.randomUUID().replace(/-/g, "") : "00000000000000000000000000000000",
  );
  const { track } = useAnalytics();

  const set = (patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  };

  const validateStep = (s: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (s === 0) {
      if (form.name.trim().length < 2) nextErrors.name = "Nama min. 2 karakter.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Email tidak valid.";
      if (form.whatsapp.trim() && !/^[0-9+()\s.-]{8,20}$/.test(form.whatsapp.trim())) nextErrors.whatsapp = "Nomor tidak valid.";
    }
    if (s === 1) {
      if (form.description.trim().length < 10) nextErrors.description = "Ceritakan minimal 10 karakter.";
    }
    if (s === 3) {
      if (!form.consent) nextErrors.consent = "Perlu persetujuan privasi untuk melanjutkan.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = ["name", "email", "whatsapp", "description", "consent"].find((k) => nextErrors[k]);
      if (first) document.getElementById(`field-${first}`)?.focus();
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    if (!startedAt.current) {
      startedAt.current = Date.now();
      track("brief_started");
    } else {
      track("brief_step_completed", { step: String(step) });
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleChip = (key: "features" | "assets", value: string) =>
    set({ [key]: form[key].includes(value) ? form[key].filter((v) => v !== value) : [...form[key], value] });

  const summary = useMemo(() => {
    const service = servicesList.find((s) => s.slug === form.serviceSlug);
    const budget = budgetRanges.find((b) => b.value === form.budgetRange);
    return [
      { label: "Nama", value: form.name || "—" },
      { label: "Kontak", value: form.preferredContact },
      { label: "Layanan", value: service?.name || form.serviceSlug || "Belum dipilih" },
      { label: "Deskripsi", value: form.description || "—" },
      { label: "Fitur", value: form.features.length ? form.features.join(", ") : "Belum ada" },
      { label: "Aset dimiliki", value: form.assets.length ? form.assets.join(", ") : "Tidak ada" },
      { label: "Target waktu", value: form.targetDate || "Belum tentu" },
      { label: "Budget", value: budget?.label ?? "Belum ditentukan" },
    ];
  }, [form]);

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setStatus("loading");
    setServerMessage("");
    const res = await submitInquiry({
      name: form.name,
      companyName: form.companyName,
      email: form.email,
      whatsapp: form.whatsapp,
      preferredContact: form.preferredContact as "WHATSAPP" | "EMAIL" | "PHONE" | "OTHER",
      serviceSlug: form.serviceSlug,
      goal: form.goal,
      description: form.description,
      features: form.features,
      assets: form.assets,
      referenceUrl: form.referenceUrl,
      targetDate: form.targetDate,
      budgetRange: form.budgetRange,
      consent: form.consent,
      honeypot: "",
      submissionKey: submissionKey.current,
      startedAt: startedAt.current ?? Date.now(),
      attachments: form.attachments,
    });
    setResult(res);
    if (res.ok) {
      setStatus("success");
      track("brief_submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStatus("error");
      track("brief_error", { reason: "submit" });
      setServerMessage(res.message);
      if (res.errors) {
        setErrors(res.errors);
        const first = Object.keys(res.errors)[0];
        if (first) document.getElementById(`field-${first}`)?.focus();
      }
    }
  };

  if (status === "success" && result?.ok) {
    return (
      <div className="rounded-2xl border-2 border-ink bg-surface p-8 text-center shadow-[6px_6px_0_0_var(--ink)]">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-mint">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">Brief terkirim!</h2>
        <p className="mx-auto mt-3 max-w-md text-ink/75">
          Terima kasih sudah bercerita. Simpan nomor referensi ini untuk keperluan follow-up:
        </p>
        <p className="mx-auto mt-4 inline-block rounded-xl border-2 border-ink bg-lemon px-5 py-2 font-display text-lg font-bold">
          {result.referenceNumber}
        </p>
        <p className="mt-4 text-sm text-ink/70">
          Kami akan menghubungimu, {responseCopy}. Mau lebih cepat?
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ToyButton
            href={whatsappLink(`Halo, saya ${form.name}. Saya baru kirim project brief nomor ${result.referenceNumber}.`, chatNumber)}
            onClick={() => track("whatsapp_click", { label: "brief_success" })}
          >
            Chat WhatsApp Sekarang
          </ToyButton>
          <ToyButton href="/" variant="secondary">
            Kembali ke Home
          </ToyButton>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-ink bg-surface shadow-[6px_6px_0_0_var(--ink)]">
      {/* Progress */}
      <div className="border-b-2 border-dashed border-ink/15 p-5 sm:p-6">
        <div className="flex items-center justify-between text-xs font-bold text-ink/50">
          <span>
            Langkah {step + 1} dari {stepLabels.length}
          </span>
          <span className="text-purple">{stepLabels[step]}</span>
        </div>
        <ol className="mt-3 flex gap-1.5" aria-label="Progres formulir">
          {stepLabels.map((label, i) => (
            <li
              key={label}
              title={label}
              className={cn(
                "h-2.5 flex-1 rounded-full border-2 border-ink",
                i <= step ? "bg-purple" : "bg-ink/10",
              )}
            />
          ))}
        </ol>
      </div>

      <form
        className="p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === stepLabels.length - 1) void handleSubmit();
          else goNext();
        }}
        noValidate
      >
        {/* honeypot */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-96" value="" readOnly />

        {step === 0 && (
          <fieldset>
            <p className="font-display text-lg font-semibold text-ink">Tentang Anda</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="field-name" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Nama <span aria-hidden className="text-coral">*</span>
                </label>
                <input
                  id="field-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="Nama kamu"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  className={cn(inputCls, errors.name && "border-danger focus-visible:outline-danger")}
                />
                {errors.name && <ErrorText id="err-name">{errors.name}</ErrorText>}
              </div>
              <div>
                <label htmlFor="field-companyName" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Nama bisnis / organisasi
                </label>
                <input
                  id="field-companyName"
                  type="text"
                  value={form.companyName}
                  onChange={(e) => set({ companyName: e.target.value })}
                  placeholder="Opsional"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="field-email" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Email <span aria-hidden className="text-coral">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set({ email: e.target.value })}
                  placeholder="nama@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={cn(inputCls, errors.email && "border-danger focus-visible:outline-danger")}
                />
                {errors.email && <ErrorText id="err-email">{errors.email}</ErrorText>}
              </div>
              <div>
                <label htmlFor="field-whatsapp" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Nomor WhatsApp
                </label>
                <input
                  id="field-whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set({ whatsapp: e.target.value })}
                  placeholder="6281234567890"
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? "err-whatsapp" : undefined}
                  className={cn(inputCls, errors.whatsapp && "border-danger focus-visible:outline-danger")}
                />
                {errors.whatsapp && <ErrorText id="err-whatsapp">{errors.whatsapp}</ErrorText>}
              </div>
            </div>
            <fieldset className="mt-4">
              <legend className="mb-2 block text-sm font-semibold text-ink/80">
                Cara kontak yang kamu pilih <span aria-hidden className="text-coral">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {preferredContacts.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set({ preferredContact: o.value })}
                    aria-pressed={form.preferredContact === o.value}
                    className={cn(chipCls, form.preferredContact === o.value && "bg-purple text-white border-ink")}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <p className="font-display text-lg font-semibold text-ink">Tentang Proyek</p>
            <div className="mt-4 space-y-5">
              <div>
                <label htmlFor="field-serviceSlug" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Jenis layanan yang kamu butuhkan
                </label>
                <select
                  id="field-serviceSlug"
                  value={form.serviceSlug}
                  onChange={(e) => set({ serviceSlug: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Pilih layanan…</option>
                  {servicesList.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-ink/80">Tujuan utama</legend>
                <div className="flex flex-wrap gap-2">
                  {goals.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set({ goal: form.goal === g ? "" : g })}
                      aria-pressed={form.goal === g}
                      className={cn(chipCls, form.goal === g && "bg-sky text-ink border-ink")}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="field-description" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Ceritakan proyeknya <span aria-hidden className="text-coral">*</span>
                </label>
                <textarea
                  id="field-description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => set({ description: e.target.value })}
                  placeholder="Contoh: toko online kami butuh website katalog yang jelas, bisa dimutakhirkan sendiri…"
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "err-description" : undefined}
                  className={cn(inputCls, "min-h-32 py-3", errors.description && "border-danger focus-visible:outline-danger")}
                />
                {errors.description && <ErrorText id="err-description">{errors.description}</ErrorText>}
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-ink/80">
                  Yang sudah kamu miliki
                </legend>
                <div className="flex flex-wrap gap-2">
                  {assetOptions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleChip("assets", a)}
                      aria-pressed={form.assets.includes(a)}
                      className={cn(chipCls, form.assets.includes(a) && "bg-mint text-ink border-ink")}
                    >
                      {form.assets.includes(a) && <Check className="h-3.5 w-3.5" />}
                      {a}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <p className="font-display text-lg font-semibold text-ink">Scope & Rentang Pekerjaan</p>
            <div className="mt-4 space-y-5">
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-ink/80">Fitur yang dibutuhkan</legend>
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleChip("features", f)}
                      aria-pressed={form.features.includes(f)}
                      className={cn(chipCls, form.features.includes(f) && "bg-lemon text-ink border-ink")}
                    >
                      {form.features.includes(f) && <Check className="h-3.5 w-3.5" />}
                      {f}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="field-referenceUrl" className="mb-1.5 block text-sm font-semibold text-ink/80">
                  Referensi URL (opsional)
                </label>
                <input
                  id="field-referenceUrl"
                  type="url"
                  value={form.referenceUrl}
                  onChange={(e) => set({ referenceUrl: e.target.value })}
                  placeholder="https://contoh-situs-yang-disukai.com"
                  className={inputCls}
                />
              </div>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold text-ink/80">Target deadline</legend>
                <div className="flex flex-wrap gap-2">
                  {targetDates.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set({ targetDate: form.targetDate === t ? "" : t })}
                      aria-pressed={form.targetDate === t}
                      className={cn(chipCls, form.targetDate === t && "bg-purple text-white border-ink")}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <p className="mb-2 block text-sm font-semibold text-ink/80">File pendukung (opsional)</p>
                <AttachmentUpload onChange={(files) => set({ attachments: files })} />
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <p className="font-display text-lg font-semibold text-ink">Budget & Konfirmasi</p>
            <div className="mt-4">
              <label htmlFor="field-budgetRange" className="mb-1.5 block text-sm font-semibold text-ink/80">
                Range budget
              </label>
              <select
                id="field-budgetRange"
                value={form.budgetRange}
                onChange={(e) => set({ budgetRange: e.target.value })}
                className={inputCls}
              >
                <option value="">Pilih range…</option>
                {budgetRanges.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 rounded-xl border-2 border-ink bg-paper p-4">
              <p className="text-sm font-bold text-ink">Ringkasan</p>
              <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {summary.map((row) => (
                  <div key={row.label} className="flex gap-2 text-sm">
                    <dt className="w-24 shrink-0 font-semibold text-ink/50">{row.label}</dt>
                    <dd className="text-ink/85">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set({ consent: e.target.checked })}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "err-consent" : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 accent-purple"
              />
              <span>
                Saya setuju informasi yang saya kirim digunakan untuk menindaklanjuti permintaan ini sesuai{" "}
                <a href="/privacy" className="font-semibold text-purple underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                  kebijakan privasi
                </a>
                . <span aria-hidden className="text-coral">*</span>
              </span>
            </label>
            {errors.consent && <ErrorText id="err-consent">{errors.consent}</ErrorText>}
          </fieldset>
        )}

        {status === "error" && (
          <p role="alert" className="mt-4 rounded-xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {serverMessage || "Terjadi kesalahan. Coba lagi."}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || status === "loading"}
            className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink bg-surface px-5 text-sm font-semibold disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
          <div className="flex items-center gap-3">
            {step === stepLabels.length - 1 ? (
              <ToyButton type="submit" size="lg" disabled={status === "loading"}>
                {status === "loading" ? "Mengirim…" : "Kirim Brief"}
              </ToyButton>
            ) : (
              <ToyButton type="submit" size="lg">
                Lanjut <ArrowRight className="h-4 w-4" />
              </ToyButton>
            )}
          </div>
        </div>
        <p className="mt-4 text-left text-xs text-ink/50">
          Field bertanda <span className="text-coral">*</span> wajib diisi.
        </p>
        <div className="mt-2 text-left">
          <Link href="/" className="text-xs font-semibold text-ink/50 underline underline-offset-2">
            Batal dan kembali ke Home
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border-2 border-ink bg-white px-3.5 text-sm text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-purple min-w-0";

const chipCls =
  "inline-flex items-center gap-1.5 rounded-full border-2 border-ink/30 bg-surface px-3.5 py-2 text-sm font-semibold text-ink/75 transition-colors hover:border-ink";

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-semibold text-danger">
      {children}
    </p>
  );
}