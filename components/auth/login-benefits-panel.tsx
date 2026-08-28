import { BadgePercentIcon, CreditCardIcon, CalendarCheckIcon } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

const benefitIcons = {
  deals: BadgePercentIcon,
  booking: CalendarCheckIcon,
  "alter-cash": CreditCardIcon,
} as const;

type LoginBenefitsPanelProps = {
  className?: string;
};

export function LoginBenefitsPanel({ className }: LoginBenefitsPanelProps) {
  const { benefitsPanel, benefits } = authConfig;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden bg-gradient-premium p-6 text-white sm:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />

      <div className="relative z-10 space-y-4">
        <Logo
          size="sm"
          className="[&_img]:brightness-0 [&_img]:invert"
        />
        <div className="space-y-2">
          {/* <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
            {benefitsPanel.headline}
          </h2> */}
          <p className="text-sm leading-relaxed text-white/80">
            {benefitsPanel.subheadline}
          </p>
        </div>
      </div>

      <ul className="relative z-10 mt-10 space-y-5">
        {benefits.map((benefit) => {
          const Icon = benefitIcons[benefit.id as keyof typeof benefitIcons];

          return (
            <li key={benefit.id} className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{benefit.title}</p>
                <p className="text-xs leading-relaxed text-white/75 sm:text-sm">
                  {benefit.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
