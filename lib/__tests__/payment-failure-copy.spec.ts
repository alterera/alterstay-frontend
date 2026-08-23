import { describe, expect, it } from "vitest";

import { toCustomerPaymentFailureMessage } from "@/lib/payment-failure-copy";

describe("toCustomerPaymentFailureMessage", () => {
  it("maps known provider codes to customer-safe copy", () => {
    expect(toCustomerPaymentFailureMessage("CARD_DECLINED")).toContain("declined");
  });

  it("falls back to a generic message for unknown codes", () => {
    expect(toCustomerPaymentFailureMessage("INTERNAL_PROVIDER_TRACE_123")).toBe(
      "Payment could not be completed. Please try again.",
    );
  });
});
