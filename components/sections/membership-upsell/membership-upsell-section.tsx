import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { membershipUpsellConfig } from "@/config/membership-upsell";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

import { MembershipGlassCard } from "./membership-glass-card";

type MembershipUpsellSectionProps = {
  className?: string;
};

export function MembershipUpsellSection({
  className,
}: MembershipUpsellSectionProps) {
  const { title, ctaLabel, benefits } = membershipUpsellConfig;

  return (
    <section className={cn("bg-background py-6 sm:py-8 lg:py-10", className)}>
      <Container>
        <div className="relative min-h-[28rem] rounded-md lg:min-h-[24rem]">
          <div className="absolute inset-0 overflow-hidden rounded-md">
            <Image
              src="/bg/wave.webp"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 72rem"
              aria-hidden
            />
          </div>

          <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:py-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
                {title}
              </h2>

              <ul className="mt-6 space-y-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <li key={benefit.id} className="flex items-start gap-3">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center text-brand"
                        aria-hidden
                      >
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="pt-2 text-sm font-medium leading-snug text-white sm:text-base">
                        {benefit.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Button
                render={<Link href={ROUTES.membershipPlans} />}
                className="mt-8 h-11 rounded-md bg-brand px-6 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
              >
                {ctaLabel}
              </Button>
            </div>

            <div className="hidden lg:block">
              <MembershipGlassCard />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
