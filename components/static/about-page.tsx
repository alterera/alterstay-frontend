import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function AboutPage() {
  return (
    <>
      <SubpageHeader title="About Us" backHref={ROUTES.home} />
      <section className="bg-background pb-16 pt-6 sm:pt-8">
        <Container className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-brand">
            Our story
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Alterstay is built for travellers who want verified stays, transparent
            pricing, and a booking experience that feels as warm as the hospitality
            waiting at the property. From short getaways to business trips across
            India, we connect you with resorts and hotels you can trust.
          </p>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="text-lg font-semibold tracking-tight">
                What we believe
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                Great travel starts with clarity — clear photos, honest rates, and
                support when plans change. We partner with properties that meet our
                quality bar and work continuously to make discovery, booking, and
                check-in smoother on every device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight">
                How Alterstay helps
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                <li>Search stays across major Indian cities with flexible dates</li>
                <li>Book with secure payments and instant confirmation</li>
                <li>Earn coins with membership after completed stays</li>
                <li>Get help quickly when you need it before or after check-in</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold tracking-tight">
                For property partners
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                We collaborate with hotels and resorts to bring their inventory to
                travellers who value quality and convenience. If you represent a
                property and want to list with Alterstay, reach out through our
                contact page.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button render={<Link href={ROUTES.search} />} className="rounded-xl">
              Find a stay
            </Button>
            <Button
              variant="outline"
              render={<Link href={ROUTES.contact} />}
              className="rounded-xl"
            >
              Contact us
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
