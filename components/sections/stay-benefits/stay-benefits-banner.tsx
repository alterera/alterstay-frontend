import { Container } from "@/components/common/container";
import { stayBenefitsConfig } from "@/config/stay-benefits";
import { cn } from "@/lib/utils";

type StayBenefitsBannerProps = {
  className?: string;
};

export function StayBenefitsBanner({ className }: StayBenefitsBannerProps) {
  const { headline, benefits } = stayBenefitsConfig;

  return (
    <section className={cn("bg-background py-6 sm:py-8 lg:py-10", className)}>
      <Container>
        <div className="rounded-3xl bg-gradient-hero px-5 py-6 text-white sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="flex flex-col gap-2 items-center lg:items-start">
              <h2 className="max-w-xs shrink-0 text-center text-2xl leading-tight font-semibold tracking-tight sm:text-3xl lg:text-left">
                {headline}
              </h2>
              <p className="mt-2 text-xs text-white/90 max-w-full text-center lg:text-left lg:max-w-none">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Consectetur hic aut rem reiciendis repellat dignissimos.
              </p>
            </div>
            <ul className="grid w-full grid-cols-2 overflow-hidden rounded-2xl bg-brand-dark/35 lg:max-w-3xl lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <li
                    key={benefit.id}
                    className={cn(
                      "relative flex flex-col items-center px-3 py-5 text-center sm:px-4 sm:py-6",
                      "after:absolute after:top-1/2 after:right-0 after:hidden after:h-[55%] after:w-px after:-translate-y-1/2 after:bg-[#ffffff]/20",
                      "max-lg:odd:after:block lg:after:block lg:last:after:hidden",
                      "before:absolute before:bottom-0 before:left-1/2 before:hidden before:h-px before:w-[55%] before:-translate-x-1/2 before:bg-[#ffffff]/20",
                      "max-lg:[&:nth-child(-n+2)]:before:block",
                    )}
                  >
                    <Icon
                      className="size-8 text-white sm:size-9"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <p className="mt-3 max-w-42 text-xs leading-snug font-medium sm:text-sm">
                      {benefit.label}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
