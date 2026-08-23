import { beforeEach, describe, expect, it, vi } from "vitest";

import * as bookingApi from "@/lib/booking-api";
import { startCheckout } from "@/lib/booking-pay-flow";
import * as cashfreeCheckout from "@/lib/cashfree-checkout";
import type { CheckoutSelection } from "@/lib/booking-checkout-state";

const selection: CheckoutSelection = {
  slug: "hotel-alpha",
  checkIn: "2026-11-17",
  checkOut: "2026-11-19",
  roomTypeId: "room-1",
  ratePlanId: "rate-1",
  userId: "user-1",
};

const request = {
  propertySlug: "hotel-alpha",
  roomTypeId: "room-1",
  ratePlanId: "rate-1",
  checkIn: "2026-11-17",
  checkOut: "2026-11-19",
  rooms: 1,
  adults: 2,
  guest: { firstName: "Asha", lastName: "Rao" },
};

describe("startCheckout payment retry", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("key-1"),
    });
    vi.spyOn(cashfreeCheckout, "openCashfreeCheckout").mockResolvedValue();
  });

  it("reuses an existing PAYMENT_PENDING reservation instead of creating another booking", async () => {
    vi.spyOn(bookingApi, "fetchBooking").mockResolvedValue({
      reservationNumber: "ALTSTAY-1",
      status: "PAYMENT_PENDING",
    } as Awaited<ReturnType<typeof bookingApi.fetchBooking>>);
    const createBooking = vi.spyOn(bookingApi, "createBooking");
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

    sessionStorage.setItem(
      "alterstays.checkout.user-1|hotel-alpha|2026-11-17|2026-11-19|room-1|rate-1",
      JSON.stringify({ idempotencyKey: "key-1", reservationNumber: "ALTSTAY-1" }),
    );

    const result = await startCheckout({ selection, request });
    expect(createBooking).not.toHaveBeenCalled();
    expect(result.reservationNumber).toBe("ALTSTAY-1");
    expect(cashfreeCheckout.openCashfreeCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        paymentSessionId: "session_test",
        cashfreeMode: "production",
      }),
    );
  });
});
