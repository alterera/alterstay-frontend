import Link from "next/link";
import { BadgePercentIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type MembershipAdSectionProps = {
  className?: string;
};

export function MembershipAdSection({ className }: MembershipAdSectionProps) {
  return (
    <section className={cn("bg-background py-6 sm:py-8", className)}>
      <Container>
        <div className="overflow-hidden rounded-3xl bg-gradient-premium px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
                <BadgePercentIcon className="size-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Alterstay Membership
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                  Get membership and unlock huge savings
                </h2>
                <p className="mt-1.5 max-w-xl text-sm text-white/80">
                  Earn coins back on every completed stay and redeem them at
                  checkout. Members get more value on every booking.
                </p>
              </div>
            </div>

            <Button
              render={<Link href={ROUTES.membership} />}
              className="h-11 shrink-0 rounded-full bg-white px-6 font-semibold text-brand hover:bg-white/90"
            >
              Get membership
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
