"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function FaqAccordion({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {items.map((faq, i) => (
        <Accordion.Item
          key={faq.question}
          value={`faq-${i}`}
          className="rounded-2xl border-2 border-ink bg-surface shadow-[3px_3px_0_0_var(--ink)]"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="font-display text-base font-semibold text-ink sm:text-lg">{faq.question}</span>
              <Plus className="h-5 w-5 shrink-0 text-ink transition-transform duration-300 ease-out group-data-[state=open]:rotate-45" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr] [&>div]:min-h-0">
            <div>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink/70">{faq.answer}</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}