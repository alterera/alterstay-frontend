import Link from "next/link";

import { Container } from "@/components/common/container";
import { faqsConfig } from "@/config/faqs";
import { cn } from "@/lib/utils";

import { FaqAccordion } from "./faq-accordion";

type FaqsSectionProps = {
  className?: string;
};

export function FaqsSection({ className }: FaqsSectionProps) {
  const { eyebrow, title, description, supportLink, items } = faqsConfig;

  return (
    <section className={cn("bg-background py-6 sm:py-16 lg:py-20", className)}>
      <Container size="narrow">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="mb-2 text-sm font-medium text-brand sm:text-base">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            {description}{" "}
            <Link
              href={supportLink.href}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-brand"
            >
              {supportLink.label}
            </Link>
            .
          </p>
        </div>

        <FaqAccordion items={items} />
      </Container>
    </section>
  );
}
