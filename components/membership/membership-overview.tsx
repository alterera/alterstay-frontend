import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { MembershipStatus } from "@/types/membership";

type MembershipOverviewProps = {
  status: MembershipStatus | null;
  loading?: boolean;
};

export function MembershipOverview({ status, loading }: MembershipOverviewProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  const completed = status?.stats?.completedBookings ?? 0;
  const tier = status?.tier ?? "Free";
  const hasActive = Boolean(status?.active);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Membership overview</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">You completed</p>
          <p className="mt-1 text-2xl font-bold">{completed}</p>
          <p className="text-sm text-muted-foreground">bookings</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current tier</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-2xl font-bold">{tier}</p>
            {!hasActive ? (
              <Button
                render={<Link href="#membership-plans" />}
                size="sm"
                className="h-8"
              >
                Upgrade →
              </Button>
            ) : null}
          </div>
          {status?.stats ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {status.stats.coinsBalance.toLocaleString("en-IN")} coins available
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
