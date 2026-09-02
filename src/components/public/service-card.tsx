import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Service, type ServiceTone } from "@/lib/content";
import { toneBg, toneSoft } from "@/lib/tone";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)]",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink", toneBg[service.tone as ServiceTone])}>
          <Icon className="h-6 w-6" />
        </span>
        <ArrowUpRight className="h-5 w-5 text-ink/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-ink">{service.name}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{service.shortDescription}</p>
      </div>
      <div className={cn("rounded-xl px-3 py-2 text-sm font-semibold", toneSoft[service.tone as ServiceTone])}>
        Cocok untuk: {service.targetClient.split(",")[0]}
      </div>
    </Link>
  );
}