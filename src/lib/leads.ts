export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "SPAM",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_META: Record<
  LeadStatus,
  { label: string; tone: string; dot: string }
> = {
  NEW: { label: "Baru", tone: "bg-sky", dot: "bg-sky" },
  CONTACTED: { label: "Dihubungi", tone: "bg-lemon", dot: "bg-lemon" },
  QUALIFIED: { label: "Qualified", tone: "bg-mint", dot: "bg-mint" },
  PROPOSAL_SENT: { label: "Proposal Terkirim", tone: "bg-purple text-white", dot: "bg-purple" },
  WON: { label: "Menang", tone: "bg-mint", dot: "bg-mint" },
  LOST: { label: "Kalah", tone: "bg-coral", dot: "bg-coral" },
  SPAM: { label: "Spam", tone: "bg-ink/60 text-white", dot: "bg-ink/60" },
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "SPAM",
];

export function parseScopeJson(value: unknown): {
  features: string[];
  referenceUrl: string | null;
  targetDate: string | null;
} {
  if (typeof value !== "object" || value === null) return { features: [], referenceUrl: null, targetDate: null };
  const v = value as Record<string, unknown>;
  return {
    features: Array.isArray(v.features) ? v.features.map(String) : [],
    referenceUrl: typeof v.referenceUrl === "string" ? v.referenceUrl : null,
    targetDate: typeof v.targetDate === "string" ? v.targetDate : null,
  };
}

export function parseAssetsJson(value: unknown): string[] {
  if (typeof value !== "object" || value === null) return [];
  const v = value as Record<string, unknown>;
  if (Array.isArray(v.has)) return v.has.map(String);
  return [];
}
