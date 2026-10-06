import { cn } from "@/lib/utils";

import {
  PricingColumn,
  type PricingColumnProps,
} from "@/components/ui/pricing-utils/pricing-column";
import { Section } from "@/components/ui/pricing-utils/section";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

export default function Pricing({
  title = "Available Plans",
  plans = [],
  className = "",
}: PricingProps) {
  return (
    <Section className={cn(className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pt-10 sm:gap-12 sm:pt-12">
        {title ? (
          <div className="max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              Alterstay Membership
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Choose the plan that fits your travel style. Upgrade anytime and
              keep every benefit you have already earned.
            </p>
          </div>
        ) : null}
        {plans !== false && plans.length > 0 ? (
          <div
            className={cn(
              "mx-auto grid w-full max-w-5xl grid-cols-1 gap-8",
              plans.length === 1 && "max-w-md",
              plans.length === 2 && "sm:grid-cols-2",
              plans.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {plans.map((plan) => (
              <PricingColumn key={plan.name} {...plan} />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
