"use client";

import {
  useAnalytics,
  type AnalyticsEvent,
  type AnalyticsProps,
} from "@/components/analytics/analytics-provider";

type TrackedAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: AnalyticsEvent;
  props?: AnalyticsProps;
};

/** <a> yang memicu event analytics lalu meneruskan tarikan normal tautan. */
export function TrackedLink({ event, props, onClick, children, ...rest }: TrackedAnchorProps) {
  const { track } = useAnalytics();
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, props);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}