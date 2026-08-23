import {
  BookingApiError,
  createBooking,
  createPaymentSession,
  fetchBooking,
} from "@/lib/booking-api";
import { openCashfreeCheckout } from "@/lib/cashfree-checkout";
import {
  clearCheckoutAttempt,
  getOrCreateIdempotencyKey,
  isTerminalBookingStatus,
  loadCheckoutAttempt,
  persistReservationNumber,
  type CheckoutSelection,
} from "@/lib/booking-checkout-state";
import type { CreateBookingRequest } from "@/types/booking";

export type StartCheckoutInput = {
  selection: CheckoutSelection;
  request: CreateBookingRequest;
};

export async function startCheckout({
  selection,
  request,
}: StartCheckoutInput): Promise<{ reservationNumber: string }> {
  const idempotencyKey = getOrCreateIdempotencyKey(selection);
  const stored = loadCheckoutAttempt(selection);
  let reservationNumber = stored?.reservationNumber;

  if (reservationNumber) {
    const existing = await fetchBooking(reservationNumber);
    if (isTerminalBookingStatus(existing.status)) {
      clearCheckoutAttempt(selection);
      reservationNumber = undefined;
    } else if (existing.status === "PAYMENT_PENDING") {
      reservationNumber = existing.reservationNumber;
      persistReservationNumber(selection, reservationNumber);
    } else {
      reservationNumber = undefined;
    }
  }

  if (!reservationNumber) {
    const created = await createBooking(request, idempotencyKey);
    reservationNumber = created.reservationNumber;
    persistReservationNumber(selection, reservationNumber);
  }

  const session = await createPaymentSession(reservationNumber);
  await openCashfreeCheckout(session);
  return { reservationNumber };
}

export function mapCheckoutError(error: unknown): {
  message: string;
  retryAfterSec?: number;
  clearCheckout?: boolean;
} {
  if (error instanceof BookingApiError) {
    const clearCheckout =
      error.statusCode === 409 &&
      (error.message.includes("no longer") ||
        error.message.includes("search again") ||
        error.message.includes("Only ") ||
        error.message.includes("No inventory"));
    return {
      message: error.message,
      retryAfterSec: error.retryAfterSec,
      clearCheckout,
    };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Something went wrong. Please try again." };
}
