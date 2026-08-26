"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  acceptAdminBooking,
  cancelAdminBooking,
  deleteAdminBooking,
  fetchAdminBookings,
  updateAdminBooking,
} from "@/lib/admin-api";
import type { AdminBooking } from "@/types/admin";

const STATUSES = [
  "ALL",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CANCELLED",
  "EXPIRED",
  "COMPLETED",
] as const;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminBooking | null>(null);
  const [guestForm, setGuestForm] = useState({
    guestFirstName: "",
    guestLastName: "",
    guestPhone: "",
    guestEmail: "",
  });

  async function load(nextStatus = status) {
    const data = await fetchAdminBookings({
      status: nextStatus === "ALL" ? undefined : nextStatus,
    });
    setBookings(data.results);
    setTotal(data.total);
  }

  useEffect(() => {
    load()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load bookings"),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(id: string, action: () => Promise<void>) {
    setBusyId(id);
    setError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Accept pending stays, update guest details, cancel, or remove records
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={status === value ? "default" : "outline"}
            onClick={() => {
              setStatus(value);
              setLoading(true);
              void load(value)
                .catch((err) =>
                  setError(
                    err instanceof Error ? err.message : "Failed to load",
                  ),
                )
                .finally(() => setLoading(false));
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
              Reservations will appear here after guests check out on the site.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{total} total</p>
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">
                    {booking.reservationNumber}
                  </CardTitle>
                  <CardDescription>
                    {booking.property.name} · {booking.checkIn} →{" "}
                    {booking.checkOut}
                  </CardDescription>
                </div>
                <Badge>{booking.status.replaceAll("_", " ")}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  {booking.guest
                    ? `${booking.guest.firstName} ${booking.guest.lastName ?? ""}`.trim()
                    : "No guest name"}
                  {booking.user.phone ? ` · ${booking.user.phone}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.items
                    .map((item) => `${item.quantity}× ${item.roomTypeName}`)
                    .join(", ")}{" "}
                  · ₹{booking.totalAmount.toLocaleString("en-IN")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {booking.status === "PAYMENT_PENDING" ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={busyId === booking.id}
                      onClick={() =>
                        void run(booking.id, () =>
                          acceptAdminBooking(booking.id).then(() => undefined),
                        )
                      }
                    >
                      Accept
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(booking);
                      setGuestForm({
                        guestFirstName: booking.guest?.firstName ?? "",
                        guestLastName: booking.guest?.lastName ?? "",
                        guestPhone: booking.guest?.phone ?? "",
                        guestEmail: booking.guest?.email ?? "",
                      });
                    }}
                  >
                    Modify
                  </Button>
                  {booking.status !== "CANCELLED" ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyId === booking.id}
                      onClick={() =>
                        void run(booking.id, () =>
                          cancelAdminBooking(booking.id).then(() => undefined),
                        )
                      }
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={busyId === booking.id}
                    onClick={() => {
                      if (!window.confirm("Delete this booking?")) return;
                      void run(booking.id, async () => {
                        await deleteAdminBooking(booking.id);
                      });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>Modify {editing.reservationNumber}</CardTitle>
            <CardDescription>Update the lead guest details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>First name</Label>
              <Input
                value={guestForm.guestFirstName}
                onChange={(e) =>
                  setGuestForm((current) => ({
                    ...current,
                    guestFirstName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Last name</Label>
              <Input
                value={guestForm.guestLastName}
                onChange={(e) =>
                  setGuestForm((current) => ({
                    ...current,
                    guestLastName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={guestForm.guestPhone}
                onChange={(e) =>
                  setGuestForm((current) => ({
                    ...current,
                    guestPhone: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={guestForm.guestEmail}
                onChange={(e) =>
                  setGuestForm((current) => ({
                    ...current,
                    guestEmail: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button
                type="button"
                disabled={busyId === editing.id}
                onClick={() =>
                  void run(editing.id, async () => {
                    await updateAdminBooking(editing.id, guestForm);
                    setEditing(null);
                  })
                }
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
