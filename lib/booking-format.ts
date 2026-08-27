import { format, parseISO } from "date-fns";

import { formatCurrency } from "@/lib/format";
import type { BookingResponse } from "@/types/booking";

/** Matches backend PAYMENT_SESSION_MIN_HOLD_REMAINING_SECONDS default (16 min). */
export const PAYMENT_MIN_HOLD_REMAINING_MS = 16 * 60 * 1000;

export function formatBookedOn(createdAt: string): string {
  return format(parseISO(createdAt), "dd-MM-yyyy");
}

export function formatStayLine(
  checkIn: string,
  checkOut: string,
  nights: number,
): string {
  const from = format(parseISO(checkIn), "d MMM");
  const to = format(parseISO(checkOut), "d MMM");
  return `From ${from} [${nights}N] ${to}`;
}

export function formatPayableAmount(booking: BookingResponse): string {
  return formatCurrency(booking.totalAmount, booking.currency);
}

export function bookingNeedsPayment(booking: BookingResponse): boolean {
  return (
    booking.status === "PAYMENT_PENDING" || booking.status === "PENDING"
  );
}

export function getHoldRemainingMs(holdExpiresAt: string | null): number | null {
  if (!holdExpiresAt) return null;
  return new Date(holdExpiresAt).getTime() - Date.now();
}

export function formatHoldCountdown(remainingMs: number): string {
  const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

export function canPayWithHoldRemaining(holdExpiresAt: string | null): boolean {
  const remaining = getHoldRemainingMs(holdExpiresAt);
  return (
    remaining !== null && remaining > PAYMENT_MIN_HOLD_REMAINING_MS
  );
}

export function buildRebookUrl(booking: BookingResponse): string {
  const item = booking.items[0];
  const params = new URLSearchParams({
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
  });
  if (item) {
    params.set("roomTypeId", item.roomTypeId);
    params.set("ratePlanId", item.ratePlanId);
  }
  return `/properties/${encodeURIComponent(booking.property.slug)}/checkout?${params.toString()}`;
}

export function getRefundStatusLabel(booking: BookingResponse): string | null {
  const payment = booking.payment;
  if (!payment) return null;

  if (payment.status === "REFUNDED") return "Refunded";
  if (payment.status === "PARTIALLY_REFUNDED") return "Partially refunded";
  if (payment.refundRequired && payment.status === "CAPTURED") {
    return "Refund in progress";
  }
  if (payment.paidAt && !payment.refundRequired) return "Paid — no refund due";

  return null;
}

export function getDirectionsUrl(booking: BookingResponse): string {
  const { latitude, longitude, name, city } = booking.property;
  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }
  const query = encodeURIComponent([name, city].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
