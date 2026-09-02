"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import {
  acceptAdminBooking,
  cancelAdminBooking,
  completeAdminBooking,
  deleteAdminBooking,
  fetchAdminBooking,
  markAdminBookingNoShow,
  refundAdminBookingPayment,
  updateAdminBooking,
} from "@/lib/admin-api";
import type { AdminBooking } from "@/types/admin";

function formatMoney(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function refundableAmount(payment: AdminBooking["payments"][number]) {
  const refunded = payment.refunds
    .filter((refund) => refund.status === "COMPLETED")
    .reduce((sum, refund) => sum + refund.amount, 0);
  return Math.max(0, payment.amount - refunded);
}

type BookingDetailViewProps = {
  bookingId: string;
};

export function BookingDetailView({ bookingId }: BookingDetailViewProps) {
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [guestForm, setGuestForm] = useState({
    guestFirstName: "",
    guestLastName: "",
    guestPhone: "",
    guestEmail: "",
    companyName: "",
    gstin: "",
    billingAddress: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminBooking(bookingId);
      setBooking(data);
      setGuestForm({
        guestFirstName: data.guest?.firstName ?? "",
        guestLastName: data.guest?.lastName ?? "",
        guestPhone: data.guest?.phone ?? "",
        guestEmail: data.guest?.email ?? "",
        companyName: data.companyName ?? "",
        gstin: data.gstin ?? "",
        billingAddress: data.billingAddress ?? "",
      });
      const refundable = data.payments.find(
        (payment) =>
          (payment.status === "CAPTURED" ||
            payment.status === "PARTIALLY_REFUNDED") &&
          refundableAmount(payment) > 0,
      );
      setSelectedPaymentId(refundable?.id ?? data.payments[0]?.id ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load booking");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading && !booking) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!booking) {
    return <p className="text-sm text-destructive">{error ?? "Not found"}</p>;
  }

  const refundablePayments = booking.payments.filter(
    (payment) =>
      (payment.status === "CAPTURED" ||
        payment.status === "PARTIALLY_REFUNDED") &&
      refundableAmount(payment) > 0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.admin.bookings}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {booking.reservationNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              <Link
                href={`/admin/properties/${booking.property.id}`}
                className="hover:underline"
              >
                {booking.property.name}
              </Link>{" "}
              · {booking.checkIn} → {booking.checkOut}
            </p>
          </div>
        </div>
        <Badge>{booking.status.replaceAll("_", " ")}</Badge>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stay details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {booking.items.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-medium">
                  {item.quantity}× {item.roomTypeName}
                </p>
                <p className="text-muted-foreground">{item.ratePlanName}</p>
                <p className="text-muted-foreground">
                  {item.checkIn} → {item.checkOut} ·{" "}
                  {formatMoney(item.totalAmount)}
                </p>
                {item.cancellationPolicyText ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.cancellationPolicyText}
                  </p>
                ) : null}
              </div>
            ))}
            <div className="border-t pt-3">
              <p>Subtotal: {formatMoney(booking.subtotal)}</p>
              <p>Tax: {formatMoney(booking.taxAmount)}</p>
              {booking.coinsRedeemed > 0 ? (
                <p>Coins redeemed: {booking.coinsRedeemed}</p>
              ) : null}
              <p className="font-medium">
                Total: {formatMoney(booking.totalAmount)}
              </p>
              {booking.coinsEarnable > 0 ? (
                <p className="text-muted-foreground">
                  Earnable coins: {booking.coinsEarnable}
                  {booking.coinsEarnedAt ? " (credited)" : ""}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guest & billing</CardTitle>
            <CardDescription>
              Account: {booking.user.firstName} {booking.user.lastName} ·{" "}
              {booking.user.phone}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>First name</Label>
                <Input
                  value={guestForm.guestFirstName}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      guestFirstName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Last name</Label>
                <Input
                  value={guestForm.guestLastName}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      guestLastName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={guestForm.guestPhone}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      guestPhone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  value={guestForm.guestEmail}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      guestEmail: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Company</Label>
                <Input
                  value={guestForm.companyName}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      companyName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>GSTIN</Label>
                <Input
                  value={guestForm.gstin}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      gstin: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Billing address</Label>
                <Input
                  value={guestForm.billingAddress}
                  onChange={(event) =>
                    setGuestForm((current) => ({
                      ...current,
                      billingAddress: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <Button
              type="button"
              disabled={busy}
              onClick={() =>
                void runAction(async () => {
                  await updateAdminBooking(booking.id, guestForm);
                  setMessage("Guest details saved");
                })
              }
            >
              Save changes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {booking.payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment attempts</p>
          ) : (
            booking.payments.map((payment) => (
              <div key={payment.id} className="rounded-md border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{payment.paymentReference}</p>
                  <Badge variant="outline">{payment.status}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {formatMoney(payment.amount)} · {payment.provider}
                  {payment.paidAt
                    ? ` · paid ${new Date(payment.paidAt).toLocaleString()}`
                    : ""}
                </p>
                {payment.refundRequired ? (
                  <p className="text-destructive">
                    Refund required
                    {payment.refundReason ? `: ${payment.refundReason}` : ""}
                  </p>
                ) : null}
                {payment.refunds.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {payment.refunds.map((refund) => (
                      <li key={refund.id}>
                        Refund {formatMoney(refund.amount)} — {refund.status}
                        {refund.reason ? ` (${refund.reason})` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          )}

          {refundablePayments.length > 0 ? (
            <div className="rounded-md border border-dashed p-4">
              <p className="mb-3 text-sm font-medium">Record refund</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <Label>Payment</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedPaymentId}
                    onChange={(event) =>
                      setSelectedPaymentId(event.target.value)
                    }
                  >
                    {refundablePayments.map((payment) => (
                      <option key={payment.id} value={payment.id}>
                        {payment.paymentReference} —{" "}
                        {formatMoney(refundableAmount(payment))} available
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Reason</Label>
                  <Input
                    value={refundReason}
                    onChange={(event) => setRefundReason(event.target.value)}
                    placeholder="Guest cancellation, duplicate charge…"
                  />
                </div>
              </div>
              <Button
                type="button"
                className="mt-3"
                variant="outline"
                disabled={busy || !refundReason.trim() || !selectedPaymentId}
                onClick={() =>
                  void runAction(async () => {
                    const result = await refundAdminBookingPayment(booking.id, {
                      paymentId: selectedPaymentId,
                      reason: refundReason.trim(),
                    });
                    setRefundReason("");
                    setMessage(
                      result.warning ??
                        `Refunded ${formatMoney(result.refundedAmount)}`,
                    );
                  })
                }
              >
                Record full refund
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {booking.statusHistory && booking.statusHistory.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Status history</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {booking.statusHistory.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap justify-between gap-2 border-b pb-2 last:border-0"
                >
                  <span>
                    {entry.fromStatus ?? "—"} → {entry.toStatus}
                    {entry.reason ? ` · ${entry.reason}` : ""}
                  </span>
                  <span className="text-muted-foreground">
                    {entry.actor} ·{" "}
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Created {new Date(booking.createdAt).toLocaleString()}
            {booking.confirmedAt
              ? ` · Confirmed ${new Date(booking.confirmedAt).toLocaleString()}`
              : ""}
            {booking.holdExpiresAt
              ? ` · Hold expires ${new Date(booking.holdExpiresAt).toLocaleString()}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {booking.status === "PAYMENT_PENDING" ? (
              <Button
                type="button"
                disabled={busy}
                onClick={() =>
                  void runAction(async () => {
                    await acceptAdminBooking(booking.id);
                    setMessage("Booking accepted");
                  })
                }
              >
                Accept (confirm without payment)
              </Button>
            ) : null}
            {booking.status === "CONFIRMED" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    void runAction(async () => {
                      await completeAdminBooking(booking.id);
                      setMessage("Stay marked completed");
                    })
                  }
                >
                  Mark completed
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    void runAction(async () => {
                      await markAdminBookingNoShow(booking.id);
                      setMessage("Marked as no-show");
                    })
                  }
                >
                  Mark no-show
                </Button>
              </>
            ) : null}
          </div>

          {booking.status !== "CANCELLED" &&
          booking.status !== "EXPIRED" &&
          booking.status !== "COMPLETED" ? (
            <div className="rounded-md border p-4">
              <Label>Cancel reason</Label>
              <Input
                className="mt-2"
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                placeholder="Optional note for audit trail"
              />
              <Button
                type="button"
                className="mt-3"
                variant="destructive"
                disabled={busy}
                onClick={() => {
                  if (
                    !window.confirm(
                      "Cancel this booking? Inventory will be released and coins refunded.",
                    )
                  ) {
                    return;
                  }
                  void runAction(async () => {
                    await cancelAdminBooking(booking.id, {
                      reason: cancelReason.trim() || undefined,
                      initiateRefund: true,
                    });
                    setCancelReason("");
                    setMessage("Booking cancelled");
                  });
                }}
              >
                Cancel booking
              </Button>
            </div>
          ) : null}

          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={() => {
              if (!window.confirm("Delete this booking record?")) return;
              void runAction(async () => {
                const result = await deleteAdminBooking(booking.id);
                setMessage(
                  result.message ??
                    (result.deleted
                      ? "Booking deleted"
                      : "Booking cancelled but kept on file due to payment history"),
                );
              });
            }}
          >
            Delete record
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
