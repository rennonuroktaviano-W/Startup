"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, FileImage } from "lucide-react";

export type FilePickerValue = { id: string; url: string; name: string } | null;

export function FilePicker({
  value,
  onChange,
  accept = "image/*",
}: {
  value: FilePickerValue;
  onChange: (v: FilePickerValue) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      if (!res.ok) { alert("Upload gagal."); return; }
      const data = await res.json();
      onChange({ id: data.id, url: data.url, name: data.name });
    } catch {
      alert("Gagal upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 border-ink bg-surface">
          {value.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) ? (
            <Image
              src={value.url}
              alt={value.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <FileImage className="h-6 w-6 text-ink/30" />
          )}
          <button
            type="button"
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-ink bg-coral text-white"
            aria-label="Hapus file"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}
      <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-ink/30 bg-surface px-4 py-2 text-sm font-semibold text-ink/60 hover:border-purple">
        <Upload className="h-4 w-4" /> {uploading ? "Mengunggah…" : "Pilih file"}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </label>
    </div>
  );
}