"use client";

import { ToyButton, type ToyButtonProps } from "@/components/ui/button";
import {
  useAnalytics,
  type AnalyticsEvent,
  type AnalyticsProps,
} from "@/components/analytics/analytics-provider";

type TrackedButtonProps = ToyButtonProps & {
  event: AnalyticsEvent;
  props?: AnalyticsProps;
};

/** ToyButton yang memicu event analytics lalu meneruskan handler asli. */
export function TrackedButton({ event, props, onClick, ...rest }: TrackedButtonProps) {
  const { track } = useAnalytics();
  return (
    <ToyButton
      {...rest}
      onClick={(e) => {
        track(event, props);
        onClick?.(e);
      }}
    />
  );
}