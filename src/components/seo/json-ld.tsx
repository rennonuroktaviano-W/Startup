import type { ReactNode } from "react";

/** Merender blok JSON-LD (dari lib/json-ld) sebagai <script type="application/ld+json">. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Per-content override JSON-LD, divalidasi minimal & dilempar kembali apa adanya. */
export function JsonLdRaw({ children }: { children: ReactNode }) {
  return <>{children}</>;
}