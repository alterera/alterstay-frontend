import {
  BookingApiError,
  createBooking,
  createPaymentSession,
} from "@/lib/booking-api";
import { openCashfreeCheckout } from "@/lib/cashfree-checkout";
import type { CreateBookingPayload, CreateBookingRequest } from "@/types/booking";

export type StartCheckoutFromIntentInput = {
  quoteToken: string;
  request: CreateBookingPayload;
  idempotencyKey: string;
};

export async function startCheckoutFromIntent({
  quoteToken,
  request,
  idempotencyKey,
}: StartCheckoutFromIntentInput): Promise<{ reservationNumber: string }> {
  const created = await createBooking(
    { ...request, quoteToken },
    idempotencyKey,
  );
  const session = await createPaymentSession(created.reservationNumber);
  await openCashfreeCheckout(session);
  return { reservationNumber: created.reservationNumber };
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
        error.message.includes("refresh") ||
        error.message.includes("quote") ||
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
