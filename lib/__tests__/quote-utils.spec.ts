import { describe, expect, it } from "vitest";

import { quoteToBill } from "@/lib/quote-utils";
import type { QuoteResponse } from "@/types/quote";

describe("quoteToBill", () => {
  it("maps coins applied and earn preview from quote", () => {
    const quote: QuoteResponse = {
      subtotal: 3000,
      gstAmount: 450,
      platformFee: 262,
      taxAmount: 712,
      discountAmount: 0,
      totalAmount: 3212,
      currency: "INR",
      nights: 1,
      rooms: 1,
      available: true,
      remainingRooms: 5,
      expiresAt: new Date().toISOString(),
      coinsRedeemed: 500,
      coinEarnPreview: {
        planCode: "INDIVIDUAL",
        earnPercent: 5,
        earnableAmount: 150,
      },
    };

    const bill = quoteToBill(quote);
    expect(bill.discount).toBe(0);
    expect(bill.coinsApplied).toBe(500);
    expect(bill.toPay).toBe(3212);
    expect(bill.coinEarnPreview?.earnableAmount).toBe(150);
  });
});
