import { HeadphonesIcon } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function HelpSupportPage() {
  return (
    <section className="bg-muted/30 py-10 sm:py-16">
      <Container className="max-w-lg text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <HeadphonesIcon className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Helpline
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Our live support desk is coming soon. For booking help, visit your
          bookings or start a search for your next stay.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button render={<Link href={ROUTES.home} />}>Back to home</Button>
          <Button variant="outline" render={<Link href={ROUTES.bookings} />}>
            My bookings
          </Button>
        </div>
      </Container>
    </section>
  );
}
