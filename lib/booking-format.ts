import { format, parseISO } from "date-fns";

import { formatCurrency } from "@/lib/format";
import type { BookingResponse } from "@/types/booking";

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
