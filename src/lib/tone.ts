export type Tone = "purple" | "sky" | "coral" | "lemon" | "mint";

export const toneBg: Record<Tone, string> = {
  purple: "bg-purple text-white",
  sky: "bg-sky text-ink",
  coral: "bg-coral text-ink",
  lemon: "bg-lemon text-ink",
  mint: "bg-mint text-ink",
};

export const toneSoft: Record<Tone, string> = {
  purple: "bg-purple/12",
  sky: "bg-sky/15",
  coral: "bg-coral/12",
  lemon: "bg-lemon/25",
  mint: "bg-mint/15",
};

export const toneIcon: Record<Tone, string> = {
  purple: "text-purple",
  sky: "text-sky",
  coral: "text-coral",
  lemon: "text-[#E8B400]",
  mint: "text-mint",
};

export const toneBorder: Record<Tone, string> = {
  purple: "border-purple/40",
  sky: "border-sky/40",
  coral: "border-coral/40",
  lemon: "border-lemon",
  mint: "border-mint/50",
};