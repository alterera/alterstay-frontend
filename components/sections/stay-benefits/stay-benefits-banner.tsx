import Image from "next/image";

import { Container } from "@/components/common/container";
import {
  STAY_BENEFIT_ICON_SRC,
  stayBenefitsConfig,
} from "@/config/stay-benefits";
import { cn } from "@/lib/utils";

type StayBenefitsBannerProps = {
  className?: string;
};

export function StayBenefitsBanner({ className }: StayBenefitsBannerProps) {
  const { benefits } = stayBenefitsConfig;

  return (
    <section className={cn("bg-background py-6 sm:py-8 lg:py-10", className)}>
      <Container>
        <div
          className={cn(
            "rounded-md bg-brand p-3 sm:rounded-md sm:p-4 lg:p-5",
          )}
        >
          <ul
            className={cn(
              "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-4",
            )}
          >
            {benefits.map((benefit) => (
              <li
                key={benefit.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl bg-white/[0.06] p-3.5 sm:gap-4 sm:p-4",
                  "ring-1 ring-white/[0.06]",
                )}
              >
                <div
                  className={cn(
                    "relative size-14 shrink-0 sm:size-16 lg:size-[4.5rem]",
                  )}
                >
                  <Image
                    src={STAY_BENEFIT_ICON_SRC}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 56px, 72px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className="text-sm font-semibold leading-snug text-charcoal sm:text-[15px]">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-black/60 sm:text-[13px]">
                    {benefit.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
