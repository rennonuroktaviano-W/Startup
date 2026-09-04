"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { LoaderCircle, RefreshCw, FileImage, Trash2 } from "lucide-react";
import { FilePicker, FilePickerValue } from "@/components/admin/cms/file-picker";
import { deleteMedia } from "@/actions/media";

type MediaItem = {
  id: string;
  name: string;
  size: number;
  modifiedAt: string;
  url: string;
  altText: string | null;
  caption: string | null;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<FilePickerValue>(null);
  const ignoreRef = useRef(false);

  const fetchItems = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/uploads${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      if (res.ok && !ignoreRef.current) setItems(await res.json());
    } finally {
      if (!ignoreRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    ignoreRef.current = false;
    const id = setTimeout(() => { void fetchItems(); }, 0);
    return () => { ignoreRef.current = true; clearTimeout(id); };
  }, []);

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Hapus file "${item.name}"?`)) return;
    setBusyId(item.id);
    setError(null);
    const result = await deleteMedia(item.id);
    setBusyId(null);
    if (!result.ok) {
      const deps = "dependencies" in result && Array.isArray(result.dependencies)
        ? `\nDipakai oleh: ${(result.dependencies as string[]).join(", ")}.`
        : "";
      setError(`${result.error}${deps}`);
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== item.id));
  };

  return (
    <div className="space-y-5">
      <FilePicker value={lastUpload} onChange={setLastUpload} />
      {lastUpload && (
        <p className="text-xs text-ink/60">
          Terunggah: <a href={lastUpload.url} target="_blank" className="underline" rel="noreferrer">{lastUpload.url}</a>
        </p>
      )}

      <div className="flex items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void fetchItems(filter); }}
          placeholder="Cari file…"
          className="h-9 w-full max-w-xs rounded-xl border-2 border-ink bg-white px-3 text-sm"
        />
        <button
          type="button"
          onClick={() => void fetchItems(filter)}
          className="flex h-9 items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-3 text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Muat
        </button>
      </div>

      {error && (
        <p className="whitespace-pre-line rounded-xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm font-semibold text-ink">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-ink/60"><LoaderCircle className="h-4 w-4 animate-spin" /> Memuat…</div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink/60">Belum ada file.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border-2 border-ink bg-surface p-1">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-ink/5">
                {item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) ? (
                  <Image
                    src={item.url}
                    alt={item.altText ?? item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                ) : (
                  <FileImage className="h-8 w-8 text-ink/20" />
                )}
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(item)}
                disabled={busyId === item.id}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-ink bg-coral text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-40"
                aria-label={`Hapus ${item.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <p className="truncate px-1 pt-1 text-[11px] font-semibold text-ink/70" title={item.name}>{item.name}</p>
              <p className="px-1 text-[10px] text-ink/40">{formatBytes(item.size)}</p>
              {(item.altText || item.caption) && (
                <p className="truncate px-1 pb-1 text-[10px] text-ink/50" title={item.altText ?? item.caption ?? ""}>
                  {item.altText ?? item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
