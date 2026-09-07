"use client";

import { ChevronDownIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/config/faqs";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  items: readonly FaqItem[];
  className?: string;
};

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  return (
    <Accordion
      className={cn(
        "grid w-full gap-x-10 gap-y-0 lg:grid-cols-2 lg:items-start",
        className,
      )}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-b border-border/70"
        >
          <AccordionTrigger
            className={cn(
              "gap-4 py-4 text-left text-sm font-semibold text-foreground hover:no-underline sm:py-5 sm:text-base",
              "**:data-[slot=accordion-trigger-icon]:hidden",
            )}
          >
            <span className="pr-2">{item.question}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className="ml-auto size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
            />
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:pb-6 sm:text-[15px]">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
