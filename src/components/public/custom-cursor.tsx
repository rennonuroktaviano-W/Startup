"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    if (!enabled) return;
    const stick = document.createElement("div");
    stick.className =
      "pointer-events-none fixed left-0 top-0 z-[60] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-lemon/70 mix-blend-multiply";
    document.body.appendChild(stick);

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const isInteractive = (e.target as HTMLElement)?.closest(
        "a, button, input, textarea, select, [contenteditable], [role=dialog], .no-cursor",
      );
      if (isInteractive) {
        stick.style.opacity = "0.35";
        stick.style.width = "36px";
        stick.style.height = "36px";
        stick.style.mixBlendMode = "normal";
      } else {
        stick.style.opacity = "1";
        stick.style.width = "24px";
        stick.style.height = "24px";
        stick.style.mixBlendMode = "multiply";
        stick.style.backgroundColor = "color-mix(in srgb, var(--lemon) 70%, transparent)";
      }
    };
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      stick.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      stick.remove();
    };
  }, [enabled]);

  return null;
}