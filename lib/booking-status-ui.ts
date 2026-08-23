import type { BookingResponse, PaymentStatus } from "@/types/booking";

const LIVE_PAYMENT: PaymentStatus[] = ["PENDING", "AUTHORIZED"];

export function isLivePayment(status: PaymentStatus): boolean {
  return LIVE_PAYMENT.includes(status);
}

export function canRetryPayment(booking: BookingResponse): boolean {
  return (
    booking.status === "PAYMENT_PENDING" &&
    booking.payment?.status === "FAILED"
  );
}

export function isAwaitingPaymentConfirmation(booking: BookingResponse): boolean {
  if (booking.status !== "PAYMENT_PENDING") return false;
  if (!booking.payment) return true;
  return isLivePayment(booking.payment.status);
}

export function isBookingSuccess(booking: BookingResponse): boolean {
  return booking.status === "CONFIRMED" || booking.status === "COMPLETED";
}

export function needsRefundNotice(booking: BookingResponse): boolean {
  return booking.payment?.refundRequired === true;
}
