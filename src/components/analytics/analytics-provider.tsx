"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export const ANALYTICS_EVENTS = [
  "page_view",
  "nav_open",
  "nav_item_click",
  "primary_cta_click",
  "whatsapp_click",
  "service_view",
  "project_view",
  "project_filter",
  "brief_started",
  "brief_step_completed",
  "brief_submitted",
  "brief_error",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsProps = Record<string, string | number | boolean>;

type TrackFn = (event: AnalyticsEvent, props?: AnalyticsProps) => void;

const AnalyticsContext = createContext<{ track: TrackFn; enabled: boolean }>({
  track: () => {},
  enabled: false,
});

export function AnalyticsProvider({
  provider,
  id,
  children,
}: {
  provider: string;
  id?: string;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const enabled = provider !== "none" && provider !== "off";
    const track: TrackFn = (event, props) => {
      if (!enabled) return;
      if (provider === "log") {
        // Hanya untuk pengembangan; tidak mengirim data ke mana pun di produksi.
        if (process.env.NODE_ENV !== "production") {
          console.log(`[analytics] ${event}`, props ?? {});
        }
        return;
      }
      // Titik ekstensi provider sungguhan (mis. POST ke endpoint sendiri).
      // Landasan: event dibaca oleh adapter yang ditambahkan di sini.
      void id;
    };
    return { track, enabled };
  }, [provider, id]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

/** Melacak page_view otomatis setiap ada perubahan pathname. */
export function PageViewTracker() {
  const pathname = usePathname();
  const { track } = useAnalytics();

  useEffect(() => {
    track("page_view", { path: pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
