import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import type { MembershipPeriod } from "@/types/membership";

type MembershipHistoryTableProps = {
  periods: MembershipPeriod[];
  loading?: boolean;
};

function statusVariant(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "ACTIVE") return "success" as const;
  if (normalized === "EXPIRED") return "secondary" as const;
  return "outline" as const;
}

export function MembershipHistoryTable({
  periods,
  loading,
}: MembershipHistoryTableProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-48 rounded-md" />
        <Skeleton className="h-56 rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Membership history
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Past and current membership periods with bookings and coins earned.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border bg-white shadow-sm">
        {periods.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No membership periods yet.
            </p>
            <Button
              render={<Link href={ROUTES.membershipPlans} />}
              className="mt-4 rounded-md"
              size="sm"
            >
              Explore plans
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Plan</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Bookings</TableHead>
                    <TableHead className="text-right">Coins earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">
                        {period.planName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {period.periodLabel}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(period.status)}>
                          {period.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {period.bookingsCount}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {period.coinsEarned.toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {periods.map((period) => (
                <div
                  key={period.id}
                  className="rounded-md border p-4 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{period.planName}</p>
                      <p className="mt-1 text-muted-foreground">
                        {period.periodLabel}
                      </p>
                    </div>
                    <Badge variant={statusVariant(period.status)}>
                      {period.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex justify-between gap-4 border-t pt-3 text-muted-foreground">
                    <span>
                      Bookings:{" "}
                      <strong className="text-foreground">
                        {period.bookingsCount}
                      </strong>
                    </span>
                    <span>
                      Coins:{" "}
                      <strong className="text-foreground">
                        {period.coinsEarned.toLocaleString("en-IN")}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
