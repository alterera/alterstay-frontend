"use client";

import Link from "next/link";
import {
  ChevronRightIcon,
  CircleHelpIcon,
  CrownIcon,
  HeadphonesIcon,
  WalletIcon,
} from "lucide-react";

import { FaqAccordion } from "@/components/sections/faqs/faq-accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { membershipFaqs } from "@/config/membership-faqs";
import { ROUTES } from "@/constants/routes";
import type { MembershipStatus } from "@/types/membership";

type MembershipAsideProps = {
  status: MembershipStatus | null;
  loading?: boolean;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MembershipAside({ status, loading }: MembershipAsideProps) {
  const active = status?.active;
  const tier = status?.tier ?? "Free";
  const hasActive = Boolean(active);

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-md border bg-white">
        <div className="bg-neutral-950 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <CrownIcon className="size-4 text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Current plan
            </p>
          </div>
          {loading ? (
            <div className="mt-3 space-y-2">
              <div className="h-7 w-32 animate-pulse rounded-md bg-white/15" />
              <div className="h-4 w-40 animate-pulse rounded-md bg-white/10" />
            </div>
          ) : (
            <>
              <p className="mt-3 text-2xl font-bold">{tier}</p>
              <p className="mt-1 text-xs text-white/70">
                {hasActive && active?.expiresAt
                  ? `Valid until ${formatDate(active.expiresAt)}`
                  : "Upgrade to unlock member savings"}
              </p>
            </>
          )}
        </div>
        <div className="p-5">
          {loading ? (
            <div className="h-10 animate-pulse rounded-xl bg-muted" />
          ) : hasActive ? (
            <div className="flex items-center justify-between gap-3">
              <Badge variant="success">Active</Badge>
              {active?.discountPercent ? (
                <span className="text-xs text-muted-foreground">
                  {active.discountPercent}% member discount
                </span>
              ) : null}
            </div>
          ) : (
            <Button
              className="w-full rounded-md"
              render={<Link href={ROUTES.membershipPlans} />}
            >
              Upgrade membership
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border bg-white p-5">
        <p className="text-sm font-semibold text-foreground">Quick links</p>
        <ul className="mt-3 space-y-1">
          {[
            {
              label: "View plans",
              href: ROUTES.membershipPlans,
              icon: CrownIcon,
            },
            {
              label: "My wallet",
              href: ROUTES.wallet,
              icon: WalletIcon,
            },
            {
              label: "Booking help",
              href: ROUTES.help.root,
              icon: HeadphonesIcon,
            },
            {
              label: "FAQs",
              href: ROUTES.help.faq,
              icon: CircleHelpIcon,
            },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/60"
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="size-4 text-muted-foreground" />
                    {link.label}
                  </span>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-md border bg-white p-5">
        <p className="text-sm font-semibold text-foreground">
          Membership FAQs
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Quick answers about plans, coins, and benefits.
        </p>
        <FaqAccordion items={membershipFaqs} className="mt-3 grid-cols-1!" />
      </div>
    </aside>
  );
}
