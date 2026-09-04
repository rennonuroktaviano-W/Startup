import { Toaster } from "sonner";
import { FloatingNav } from "@/components/public/floating-nav";
import { ClosingPlayground } from "@/components/public/closing-playground";
import { CustomCursor } from "@/components/public/custom-cursor";
import { VisibilityPause } from "@/components/public/visibility-pause";
import { AnalyticsProvider, PageViewTracker } from "@/components/analytics/analytics-provider";
import { getPublicSettings } from "@/lib/public-settings";
import { getAnalyticsConfig } from "@/lib/analytics";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, analytics] = await Promise.all([getPublicSettings(), getAnalyticsConfig()]);

  return (
    <AnalyticsProvider provider={analytics.provider} id={analytics.id}>
      <PageViewTracker />
      <a
        href="#main"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full border-2 border-ink bg-surface px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_var(--ink)] transition-transform focus:translate-y-0"
      >
        Lompat ke konten
      </a>
      <FloatingNav brandName={settings.brand.name} />
      <main id="main">{children}</main>
      <ClosingPlayground />
      <CustomCursor />
      <VisibilityPause />
      <Toaster position="top-center" closeButton richColors />
    </AnalyticsProvider>
  );
}