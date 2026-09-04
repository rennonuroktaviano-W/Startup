import "server-only";

/**
 * Konfigurasi analytics dibaca dari environment di sisi server, lalu
 * diteruskan ke <AnalyticsProvider> agar tidak bocor ke client bundle.
 * Provider "none" artinya analytics dimatikan total (default).
 */
export function getAnalyticsConfig() {
  return {
    provider: process.env.ANALYTICS_PROVIDER ?? "none",
    id: process.env.ANALYTICS_ID ?? "",
  };
}
