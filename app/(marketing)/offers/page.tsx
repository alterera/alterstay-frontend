import { HeadphonesIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

export default function OffersPage() {
  return (
    <section className="bg-muted/30 py-10 sm:py-16">
      <Container className="max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <HeadphonesIcon className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Offers</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Exclusive deals and member-only offers are coming soon. Check back
          shortly, or talk to our team if you need help with a booking.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button render={<Link href={ROUTES.home} />}>Back to home</Button>
          <Button
            variant="outline"
            render={<Link href={ROUTES.help.support} />}
          >
            Contact support
          </Button>
        </div>
      </Container>
    </section>
  );
}
