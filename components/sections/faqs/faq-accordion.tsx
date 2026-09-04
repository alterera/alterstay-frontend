"use client";

import { PlusIcon } from "lucide-react";

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
    <Accordion className={cn("w-full", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-b border-border/70 first:border-t first:border-border/70"
        >
          <AccordionTrigger
            className={cn(
              "gap-4 py-4 text-sm font-semibold text-foreground hover:no-underline sm:py-2 sm:text-base",
              "**:data-[slot=accordion-trigger-icon]:hidden"
            )}
          >
            <span className="pr-2">{item.question}</span>
            <span
              aria-hidden="true"
              className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-aria-expanded/accordion-trigger:border-foreground/20 group-aria-expanded/accordion-trigger:bg-muted group-aria-expanded/accordion-trigger:text-foreground sm:size-9"
            >
              <PlusIcon className="size-4 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45" />
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:pb-6 sm:text-[15px]">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
