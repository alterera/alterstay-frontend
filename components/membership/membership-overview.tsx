import Link from "next/link";
import { CalendarCheckIcon, CoinsIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {hint}
          </Badge>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

export function MembershipOverview({ status, loading }: MembershipOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-40 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  const completed = status?.stats?.completedBookings ?? 0;
  const coins = status?.stats?.coinsBalance ?? 0;
  const lifetimeCoins = status?.stats?.coinsEarnedLifetime ?? 0;
  const tier = status?.tier ?? "Free";
  const hasActive = Boolean(status?.active);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your membership activity at a glance.
          </p>
        </div>
        {!hasActive ? (
          <Button
            render={<Link href={ROUTES.membershipPlans} />}
            size="sm"
            className="rounded-xl"
          >
            Upgrade plan
          </Button>
        ) : null}
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
          hint={hasActive ? "Active" : "Free"}
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
