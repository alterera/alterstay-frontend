import Link from "next/link";
import {
  CalendarCheckIcon,
  CoinsIcon,
  CrownIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import type { MembershipStatus } from "@/types/membership";

type MembershipOverviewProps = {
  status: MembershipStatus | null;
  loading?: boolean;
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon className="size-5" />
        </div>
        {hint ? (
          <span className="rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function MembershipUpsellPanel() {
  return (
    <div className="relative overflow-hidden rounded-md border border-brand/20 bg-gradient-to-br from-brand/10 via-white to-premium/10 p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-brand/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/80 px-3 py-1 text-xs font-medium text-brand">
            <CrownIcon className="size-3.5" />
            Alterstay Membership
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Unlock member rates, coins, and exclusive perks
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Join thousands of travellers saving on every stay. Earn coins on
            bookings, access member-only offers, and enjoy priority benefits
            across India.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: CoinsIcon, text: "Earn coins on every stay" },
              { icon: SparklesIcon, text: "Member-only rates & offers" },
              { icon: CalendarCheckIcon, text: "12 months of benefits" },
            ].map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-2 rounded-md border bg-white/80 px-3 py-2.5 text-sm text-foreground"
              >
                <item.icon className="size-4 shrink-0 text-brand" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <Button
            render={<Link href={ROUTES.membershipPlans} />}
            size="lg"
            className="h-12 rounded-md px-8"
          >
            View membership plans
          </Button>
          <Button
            render={<Link href={ROUTES.search} />}
            variant="outline"
            size="lg"
            className="h-12 rounded-md px-8"
          >
            Browse stays first
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MembershipOverview({ status, loading }: MembershipOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-40 rounded-md" />
        <Skeleton className="h-52 rounded-md" />
      </div>
    );
  }

  const hasActive = Boolean(status?.active);

  if (!hasActive) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Membership</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start saving on every booking with Alterstay membership.
          </p>
        </div>
        <MembershipUpsellPanel />
      </div>
    );
  }

  const completed = status?.stats?.completedBookings ?? 0;
  const coins = status?.stats?.coinsBalance ?? 0;
  const lifetimeCoins = status?.stats?.coinsEarnedLifetime ?? 0;
  const tier = status?.tier ?? "Free";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your membership activity at a glance.
          </p>
        </div>
        <Button
          render={<Link href={ROUTES.membershipPlans} />}
          size="sm"
          variant="outline"
          className="rounded-md"
        >
          Upgrade plan
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={CalendarCheckIcon}
          label="Completed bookings"
          value={completed.toLocaleString("en-IN")}
          hint="Stays"
        />
        <StatCard
          icon={CoinsIcon}
          label="Coins available"
          value={coins.toLocaleString("en-IN")}
          hint="Wallet"
        />
        <StatCard
          icon={TrendingUpIcon}
          label="Current tier"
          value={tier}
          hint="Active"
        />
      </div>

      {lifetimeCoins > 0 ? (
        <p className="text-sm text-muted-foreground">
          You&apos;ve earned{" "}
          <span className="font-medium text-foreground">
            {lifetimeCoins.toLocaleString("en-IN")} coins
          </span>{" "}
          lifetime. View details on{" "}
          <Link href={ROUTES.wallet} className="font-medium text-brand underline">
            Wallet
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
