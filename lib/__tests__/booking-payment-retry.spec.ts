import { beforeEach, describe, expect, it, vi } from "vitest";

import * as bookingApi from "@/lib/booking-api";
import { startCheckoutFromIntent } from "@/lib/booking-pay-flow";
import * as cashfreeCheckout from "@/lib/cashfree-checkout";

const request = {
  quoteToken: "quote-1",
  propertySlug: "hotel-alpha",
  roomTypeId: "room-1",
  ratePlanId: "rate-1",
  checkIn: "2026-11-17",
  checkOut: "2026-11-19",
  rooms: 1,
  adults: 2,
  guest: { firstName: "Asha", lastName: "Rao" },
};

describe("startCheckoutFromIntent", () => {
  beforeEach(() => {
    vi.spyOn(cashfreeCheckout, "openCashfreeCheckout").mockResolvedValue();
  });

  it("creates a booking from the quote token then opens payment", async () => {
    vi.spyOn(bookingApi, "createBooking").mockResolvedValue({
      reservationNumber: "ALTSTAY-1",
      status: "PAYMENT_PENDING",
    } as Awaited<ReturnType<typeof bookingApi.createBooking>>);
    vi.spyOn(bookingApi, "createPaymentSession").mockResolvedValue({
      checkoutUrl: "https://pay.example/checkout",
      paymentSessionId: "session_test",
      cashfreeMode: "production",
      paymentReference: "PAY-1",
      amount: "11800.00",
      currency: "INR",
      sessionExpiresAt: null,
      holdExpiresAt: null,
    });

    const result = await startCheckoutFromIntent({
      quoteToken: "quote-1",
      request,
      idempotencyKey: "key-1",
    });

    expect(bookingApi.createBooking).toHaveBeenCalledWith(
      { ...request, quoteToken: "quote-1" },
      "key-1",
    );
    expect(result.reservationNumber).toBe("ALTSTAY-1");
    expect(cashfreeCheckout.openCashfreeCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentSessionId: "session_test",
        cashfreeMode: "production",
      }),
    );
  });
});
