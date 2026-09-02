"use client";

import { useState, useEffect, useRef } from "react";
import { LoaderCircle, RefreshCw, FileImage } from "lucide-react";
import { FilePicker, FilePickerValue } from "@/components/admin/cms/file-picker";

type MediaItem = { name: string; size: number; modifiedAt: string; url: string };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [lastUpload, setLastUpload] = useState<FilePickerValue>(null);
  const ignoreRef = useRef(false);

  const fetchItems = async (q?: string) => {
    setLoading(true);
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

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-ink/60"><LoaderCircle className="h-4 w-4 animate-spin" /> Memuat…</div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink/60">Belum ada file.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.name} className="group relative overflow-hidden rounded-xl border-2 border-ink bg-surface p-1">
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-ink/5">
                {item.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <FileImage className="h-8 w-8 text-ink/20" />
                )}
              </div>
              <p className="truncate px-1 pt-1 text-[11px] font-semibold text-ink/70">{item.name}</p>
              <p className="px-1 text-[10px] text-ink/40">{formatBytes(item.size)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}