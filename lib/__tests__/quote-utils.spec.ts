import { describe, expect, it } from "vitest";

import { quoteToBill } from "@/lib/quote-utils";
import type { QuoteResponse } from "@/types/quote";

describe("quoteToBill", () => {
  it("maps coins applied and earn preview from quote", () => {
    const quote: QuoteResponse = {
      subtotal: 3000,
      taxAmount: 450,
      discountAmount: 0,
      totalAmount: 2950,
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
    expect(bill.toPay).toBe(2950);
    expect(bill.coinEarnPreview?.earnableAmount).toBe(150);
  });
});
