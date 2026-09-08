import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import type { MembershipPeriod } from "@/types/membership";

type MembershipHistoryTableProps = {
  periods: MembershipPeriod[];
  loading?: boolean;
};

export function MembershipHistoryTable({
  periods,
  loading,
}: MembershipHistoryTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border bg-white p-6">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="mt-4 h-32 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="text-lg font-semibold">Membership history</h2>

      {periods.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No membership periods yet.
          </p>
          <Button
            render={<Link href={ROUTES.membershipPlans} />}
            className="mt-4"
            size="sm"
          >
            View plans
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Membership period</th>
                  <th className="pb-3 pr-4 font-medium">Summary</th>
                  <th className="pb-3 pr-4 font-medium">Bookings</th>
                  <th className="pb-3 font-medium">Coins</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => (
                  <tr key={period.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{period.planName}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {period.periodLabel}
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                        {period.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{period.bookingsCount}</td>
                    <td className="py-3">
                      {period.coinsEarned.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {periods.map((period) => (
              <div
                key={period.id}
                className="rounded-xl border p-4 text-sm"
              >
                <p className="font-medium">{period.planName}</p>
                <p className="mt-1 text-muted-foreground">{period.periodLabel}</p>
                <div className="mt-3 flex justify-between gap-4">
                  <span>
                    Bookings: <strong>{period.bookingsCount}</strong>
                  </span>
                  <span>
                    Coins:{" "}
                    <strong>
                      {period.coinsEarned.toLocaleString("en-IN")}
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        View full coin history on{" "}
        <Link href={ROUTES.wallet} className="underline">
          Wallet
        </Link>
        .
      </p>
    </div>
  );
}
