import Link from "next/link";
import { ListTree } from "lucide-react";
import type { Heading } from "@/lib/headings";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav
      aria-label="Daftar isi"
      className="mb-10 rounded-2xl border-2 border-ink bg-lemon/40 p-5 shadow-[4px_4px_0_0_var(--ink)]"
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/60">
        <ListTree className="h-4 w-4" /> Daftar isi
      </p>
      <ul className="mt-3 space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <Link href={`#${h.id}`} className="text-sm font-medium text-ink/75 hover:text-purple">
              {h.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
