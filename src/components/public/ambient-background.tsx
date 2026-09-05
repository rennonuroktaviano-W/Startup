import { cn } from "@/lib/utils";

type Blob = {
  color: string;
  size: string;
  x: string;
  y: string;
  duration: string;
  delay: string;
};

const BLOBS: Blob[] = [
  { color: "bg-purple/45", size: "48vmin", x: "-8%", y: "-12%", duration: "14s", delay: "0s" },
  { color: "bg-sky/40", size: "42vmin", x: "64%", y: "2%", duration: "17s", delay: "-6s" },
  { color: "bg-lemon/45", size: "34vmin", x: "-10%", y: "52%", duration: "12s", delay: "-3s" },
  { color: "bg-coral/40", size: "32vmin", x: "74%", y: "66%", duration: "18s", delay: "-10s" },
  { color: "bg-mint/40", size: "40vmin", x: "30%", y: "30%", duration: "15s", delay: "-14s" },
  { color: "bg-purple/35", size: "28vmin", x: "44%", y: "84%", duration: "13s", delay: "-8s" },
  { color: "bg-sky/35", size: "30vmin", x: "2%", y: "22%", duration: "19s", delay: "-20s" },
];

/**
 * Ambient blob mesh — dekorasi latar semua halaman publik.
 * Murni CSS (tanpa JS), mengikuti aturan yang sudah ada:
 * - html.decorations-off      → disembunyikan lewat [data-decor]
 * - prefers-reduced-motion    → diam (aturan global globals.css)
 * - html.motion-paused        → dijeda (aturan global globals.css)
 * - html.motion-calm/extra    → kecepatan menyesuaikan
 */
export function AmbientBackground() {
  return (
    <div
      data-decor
      data-ambient-bg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className={cn("ambient-blob absolute rounded-full blur-[60px]", b.color)}
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}