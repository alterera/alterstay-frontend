import {
  BadgePercentIcon,
  BellIcon,
  CrownIcon,
  SparklesIcon,
  TagIcon,
} from "lucide-react";
import Link from "next/link";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const UPCOMING_PERKS = [
  {
    icon: TagIcon,
    title: "Member-only rates",
    description:
      "Unlock extra savings on handpicked stays when you book as an Alterstay member.",
  },
  {
    icon: CrownIcon,
    title: "Early access drops",
    description:
      "Be the first to claim limited-time deals on premium hotels and weekend getaways.",
  },
  {
    icon: SparklesIcon,
    title: "Seasonal bundles",
    description:
      "Curated packages with perks like late checkout, dining credits, and room upgrades.",
  },
];

export default function OffersPage() {
  return (
    <>
      <SubpageHeader title="Offers" backHref={ROUTES.home} mobileOnly />

      <section className="relative overflow-hidden border-b bg-neutral-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.14),transparent)]"
          aria-hidden="true"
        />
        <Container className="relative max-w-5xl py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <BadgePercentIcon className="size-3.5 text-brand" />
              Offers launching soon
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Exclusive deals are on the way
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              We&apos;re lining up member-only rates, seasonal bundles, and
              limited drops for Alterstay guests. Check back soon — or join
              membership to be first in line.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="rounded-xl px-6"
                render={<Link href={ROUTES.membershipPlans} />}
              >
                Explore membership
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                render={<Link href={ROUTES.search} />}
              >
                Browse stays
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted/20 py-12 sm:py-16">
        <Container className="max-w-5xl">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              What to expect
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              A preview of the offer types we&apos;re preparing for you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <article
                  key={perk.title}
                  className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {perk.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <BellIcon className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Want a heads-up when offers go live?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Join Alterstay membership today and you&apos;ll be among the
                  first to access new deals as they drop.
                </p>
              </div>
            </div>
            <Button
              className="mt-5 w-full rounded-xl sm:mt-0 sm:w-auto"
              render={<Link href={ROUTES.membershipPlans} />}
            >
              View plans
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
