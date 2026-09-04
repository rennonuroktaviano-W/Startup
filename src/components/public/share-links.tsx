"use client";

import { useState } from "react";
import { Link2, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? window.location.origin + url : url;
  const encode = encodeURIComponent;
  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encode(`${title} — ${fullUrl}`)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encode(fullUrl)}&text=${encode(title)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encode(fullUrl)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink/50">
        <Share2 className="h-4 w-4" /> Bagikan
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-ink bg-surface px-3 py-1 text-xs font-semibold text-ink transition-colors hover:bg-ink/5"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className={cn(
          "flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-xs font-semibold transition-colors",
          copied ? "bg-mint" : "bg-surface hover:bg-ink/5",
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Disalin" : "Salin link"}
      </button>
    </div>
  );
}
