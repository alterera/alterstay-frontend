import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearCheckoutSession,
  getOrCreateCheckoutIdempotencyKey,
  loadCheckoutSession,
  saveCheckoutSession,
} from "@/lib/booking-checkout-state";
import type { QuoteSelectionInput } from "@/types/quote";

const selection: QuoteSelectionInput = {
  propertySlug: "hotel-alpha",
  roomTypeId: "room-1",
  ratePlanId: "rate-1",
  checkIn: "2026-11-17",
  checkOut: "2026-11-19",
  rooms: 1,
  adults: 2,
};

const quote = {
  subtotal: 10000,
  taxAmount: 1800,
  discountAmount: 0,
  totalAmount: 11800,
  currency: "INR",
  nights: 2,
  rooms: 1,
  available: true,
  remainingRooms: 2,
  expiresAt: "2026-11-17T12:00:00.000Z",
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

  it("stores and loads quote checkout sessions", () => {
    saveCheckoutSession(selection, {
      quoteToken: "quote-1",
      expiresAt: "2026-11-17T12:00:00.000Z",
      quote,
    });
    expect(loadCheckoutSession(selection)).toEqual({
      quoteToken: "quote-1",
      expiresAt: "2026-11-17T12:00:00.000Z",
      quote,
    });
  });

  it("reuses the same idempotency key for the same selection", () => {
    saveCheckoutSession(selection, {
      quoteToken: "quote-1",
      expiresAt: "2026-11-17T12:00:00.000Z",
      quote,
      idempotencyKey: "key-1",
    });
    expect(getOrCreateCheckoutIdempotencyKey(selection)).toBe("key-1");
    expect(getOrCreateCheckoutIdempotencyKey(selection)).toBe("key-1");
  });

  it("clears only when explicitly requested", () => {
    saveCheckoutSession(selection, {
      quoteToken: "quote-1",
      expiresAt: "2026-11-17T12:00:00.000Z",
      quote,
    });
    clearCheckoutSession(selection);
    expect(loadCheckoutSession(selection)).toBeNull();
  });

  it("uses a different storage key for a different selection", () => {
    saveCheckoutSession(selection, {
      quoteToken: "quote-1",
      expiresAt: "2026-11-17T12:00:00.000Z",
      quote,
    });
    const other = { ...selection, roomTypeId: "room-2" };
    expect(loadCheckoutSession(other)).toBeNull();
  });
});
