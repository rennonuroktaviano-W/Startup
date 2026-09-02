import { cn } from "@/lib/utils";
import { type Tone, toneBg } from "@/lib/tone";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeader({
  sticker,
  title,
  subtitle,
  tone = "purple",
  align = "left",
  className,
}: {
  sticker: string;
  title: React.ReactNode;
  subtitle?: string;
  tone?: Tone;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto flex flex-col items-center text-center",
        className,
      )}
    >
      <p
        className={cn(
          "toy-sticker -rotate-1",
          tone === "purple" && "bg-purple text-white",
          tone !== "purple" && toneBg[tone],
        )}
      >
        {sticker}
      </p>
      <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}