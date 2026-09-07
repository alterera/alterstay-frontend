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
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        {(title) && (
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
            {title ? (
              <h1 className="text-xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
                {title}
              </h1>
            ) : null}
          </div>
        )}
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
