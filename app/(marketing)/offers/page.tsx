import { BadgePercentIcon } from "lucide-react";
import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function OffersPage() {
  return (
    <>
      <SubpageHeader title="Offers" backHref={ROUTES.home} />
      <section className="bg-muted/30 py-10 sm:py-16">
        <Container className="max-w-lg text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
            <BadgePercentIcon className="size-7" />
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Exclusive deals and member-only offers are coming soon. Check back
            shortly, or talk to our team if you need help with a booking.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button render={<Link href={ROUTES.membershipPlans} />}>
              View membership
            </Button>
            <Button variant="outline" render={<Link href={ROUTES.help.root} />}>
              Get help
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
