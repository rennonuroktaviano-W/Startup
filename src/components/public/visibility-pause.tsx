"use client";

import { useEffect } from "react";

/**
 * Pauses all CSS animations across the public site when the tab is hidden or
 * when the decorated hero is scrolled out of view, to protect the performance
 * budget (PRD §27). Respects prefers-reduced-motion by doing nothing.
 */
export function VisibilityPause() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>("[data-motion-hero]");

    let heroActive = true;

    const applyPaused = () => {
      const hidden = document.hidden || !heroActive;
      root.classList.toggle("motion-paused", hidden);
    };

    const onVis = () => applyPaused();

    let observer: IntersectionObserver | null = null;
    if (hero && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          heroActive = entries[0]?.isIntersecting ?? true;
          applyPaused();
        },
        { threshold: 0.05 },
      );
      observer.observe(hero);
    }

    document.addEventListener("visibilitychange", onVis);
    applyPaused();

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      observer?.disconnect();
    };
  }, []);

  return null;
}
