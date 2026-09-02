"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { fetchAdminBookings } from "@/lib/admin-api";
import type { AdminBooking } from "@/types/admin";

const STATUSES = [
  "ALL",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CANCELLED",
  "EXPIRED",
  "COMPLETED",
  "NO_SHOW",
] as const;

function formatMoney(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function statusVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "default" as const;
    case "PAYMENT_PENDING":
      return "secondary" as const;
    case "CANCELLED":
    case "EXPIRED":
    case "NO_SHOW":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export function AdminBookingList() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [refundOnly, setRefundOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (nextPage = page) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminBookings({
          page: nextPage,
          limit: 20,
          status: status === "ALL" ? undefined : status,
          q: search || undefined,
          refundRequired: refundOnly || undefined,
        });
        setBookings(data.results);
        setTotal(data.total);
        setPage(data.page);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    },
    [page, refundOnly, search, status],
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Search, review, and manage guest reservations
        </p>
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSearch(searchInput.trim());
          setPage(1);
        }}
      >
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search reservation number…"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        <Button
          type="button"
          variant={refundOnly ? "default" : "outline"}
          onClick={() => {
            setRefundOnly((current) => !current);
            setPage(1);
          }}
        >
          Refund required
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={status === value ? "default" : "outline"}
            onClick={() => {
              setStatus(value);
              setPage(1);
            }}
          >
            {value.replaceAll("_", " ")}
          </Button>
        ))}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {loading ? (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No bookings</CardTitle>
            <CardDescription>
              Try a different filter or search term.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {total} total · page {page}
          </p>
          {bookings.map((booking) => {
            const needsRefund = booking.payments.some(
              (payment) => payment.refundRequired,
            );
            return (
              <Card key={booking.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      <Link
                        href={ROUTES.admin.booking(booking.id)}
                        className="hover:underline"
                      >
                        {booking.reservationNumber}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      <Link
                        href={`/admin/properties/${booking.property.id}`}
                        className="hover:underline"
                      >
                        {booking.property.name}
                      </Link>{" "}
                      · {booking.checkIn} → {booking.checkOut}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={statusVariant(booking.status)}>
                      {booking.status.replaceAll("_", " ")}
                    </Badge>
                    {needsRefund ? (
                      <Badge variant="destructive">Refund due</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    {booking.guest
                      ? `${booking.guest.firstName} ${booking.guest.lastName ?? ""}`.trim()
                      : "No guest name"}
                    {booking.user.phone ? ` · ${booking.user.phone}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.items
                      .map(
                        (item) =>
                          `${item.quantity}× ${item.roomTypeName} (${item.ratePlanName})`,
                      )
                      .join(", ")}{" "}
                    · {formatMoney(booking.totalAmount)}
                    {booking.coinsRedeemed > 0
                      ? ` · ${booking.coinsRedeemed} coins redeemed`
                      : ""}
                  </p>
                  <Link
                    href={ROUTES.admin.booking(booking.id)}
                    className={buttonVariants({ size: "sm", variant: "outline" })}
                  >
                    Manage booking
                  </Link>
                </CardContent>
              </Card>
            );
          })}

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => void load(page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!hasMore || loading}
              onClick={() => void load(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
