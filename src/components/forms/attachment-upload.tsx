"use client";

import { useRef, useState } from "react";
import { Paperclip, LoaderCircle, X, FileText } from "lucide-react";

export interface AttachmentDescriptor {
  uploadId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

const MAX_FILES = 3;

export function AttachmentUpload({
  onChange,
}: {
  onChange: (files: AttachmentDescriptor[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<AttachmentDescriptor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(selected: FileList | null) {
    if (!selected || selected.length === 0) return;
    setError("");
    const remaining = MAX_FILES - items.length;
    const toUpload = Array.from(selected).slice(0, remaining);
    if (toUpload.length < selected.length) {
      setError(`Maksimal ${MAX_FILES} file.`);
    }
    if (toUpload.length === 0) return;

    setLoading(true);
    try {
      const fd = new FormData();
      toUpload.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/attachments", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Gagal mengunggah file.");
      } else {
        const next = [...items, ...(data.files as AttachmentDescriptor[])];
        setItems(next);
        onChange(next);
      }
    } catch {
      setError("Gagal mengunggah file.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    onChange(next);
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-ink/25 bg-paper p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading || items.length >= MAX_FILES}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-surface px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          {loading ? "Mengunggah..." : "Lampirkan file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.ppt,.pptx,.zip"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <span className="text-xs text-ink/55">Maks. {MAX_FILES} file · masing-masing 5 MB (PDF, gambar, doc, zip)</span>
      </div>

      {error && <p role="alert" className="mt-2 text-sm font-semibold text-danger">{error}</p>}

      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((f, i) => (
            <li key={f.uploadId} className="flex items-center justify-between gap-2 rounded-lg border border-ink/20 bg-surface px-3 py-2">
              <span className="flex min-w-0 items-center gap-2 text-sm text-ink">
                <FileText className="h-4 w-4 shrink-0 text-purple" />
                <span className="truncate">{f.originalName}</span>
                <span className="shrink-0 text-xs text-ink/50">({(f.sizeBytes / 1024).toFixed(0)} KB)</span>
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Hapus file"
                className="rounded-full p-1 text-ink/60 hover:bg-danger/10 hover:text-danger"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}