import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearCheckoutAttempt,
  getOrCreateIdempotencyKey,
  loadCheckoutAttempt,
  persistReservationNumber,
  saveCheckoutAttempt,
  type CheckoutSelection,
} from "@/lib/booking-checkout-state";

const selection: CheckoutSelection = {
  slug: "hotel-alpha",
  checkIn: "2026-11-17",
  checkOut: "2026-11-19",
  roomTypeId: "room-1",
  ratePlanId: "rate-1",
  userId: "user-1",
};

describe("booking-checkout-state", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("crypto", {
      randomUUID: vi
        .fn()
        .mockReturnValueOnce("key-1")
        .mockReturnValueOnce("key-2"),
    });
  });

  it("reuses the same idempotency key for the same selection", () => {
    expect(getOrCreateIdempotencyKey(selection)).toBe("key-1");
    expect(getOrCreateIdempotencyKey(selection)).toBe("key-1");
  });

  it("persists reservationNumber without clearing the idempotency key", () => {
    getOrCreateIdempotencyKey(selection);
    persistReservationNumber(selection, "ALTSTAY-1");
    expect(loadCheckoutAttempt(selection)).toEqual({
      idempotencyKey: "key-1",
      reservationNumber: "ALTSTAY-1",
    });
  });

  it("does not clear state when simulating a redirect handoff", () => {
    saveCheckoutAttempt(selection, {
      idempotencyKey: "key-1",
      reservationNumber: "ALTSTAY-1",
    });
    expect(loadCheckoutAttempt(selection)?.reservationNumber).toBe("ALTSTAY-1");
  });

  it("clears only when explicitly requested", () => {
    persistReservationNumber(selection, "ALTSTAY-1");
    clearCheckoutAttempt(selection);
    expect(loadCheckoutAttempt(selection)).toBeNull();
  });

  it("uses a different storage key for a different selection", () => {
    const first = getOrCreateIdempotencyKey(selection);
    const second = getOrCreateIdempotencyKey({
      ...selection,
      roomTypeId: "room-2",
    });
    expect(first).toBe("key-1");
    expect(second).toBe("key-2");
  });
});
