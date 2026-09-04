"use client";

import { useEffect, useRef } from "react";
import {
  useAnalytics,
  type AnalyticsEvent,
  type AnalyticsProps,
} from "@/components/analytics/analytics-provider";

/** Memicu event analytics tepat satu kali saat komponen dipasang. */
export function TrackOnce({ event, props }: { event: AnalyticsEvent; props?: AnalyticsProps }) {
  const { track } = useAnalytics();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}