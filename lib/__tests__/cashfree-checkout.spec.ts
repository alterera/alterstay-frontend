import { beforeEach, describe, expect, it, vi } from "vitest";

const { checkoutMock } = vi.hoisted(() => ({
  checkoutMock: vi.fn(),
}));

vi.mock("@cashfreepayments/cashfree-js", () => ({
  load: vi.fn().mockResolvedValue({
    checkout: checkoutMock,
  }),
}));

import { load } from "@cashfreepayments/cashfree-js";
import {
  openCashfreeCheckout,
  resolveCashfreeCheckout,
} from "@/lib/cashfree-checkout";

describe("resolveCashfreeCheckout", () => {
  it("prefers the explicit paymentSessionId", () => {
    expect(
      resolveCashfreeCheckout({
        paymentSessionId: "session_live",
        checkoutUrl: "https://payments.cashfree.com/order/#session_other",
        cashfreeMode: "production",
      }),
    ).toEqual({ paymentSessionId: "session_live", mode: "production" });
  });

  it("extracts the session from checkoutUrl when the API omitted paymentSessionId", () => {
    expect(
      resolveCashfreeCheckout({
        checkoutUrl:
          "https://payments.cashfree.com/order/#session_hw5ovT-mSQw2LD8i",
      }),
    ).toEqual({
      paymentSessionId: "session_hw5ovT-mSQw2LD8i",
      mode: "production",
    });
  });

  it("infers sandbox from the test checkout host", () => {
    expect(
      resolveCashfreeCheckout({
        checkoutUrl:
          "https://payments-test.cashfree.com/order/#session_sandbox",
      }).mode,
    ).toBe("sandbox");
  });
});

describe("openCashfreeCheckout", () => {
  beforeEach(() => {
    checkoutMock.mockReset();
    checkoutMock.mockResolvedValue({});
    vi.mocked(load).mockClear();
  });

  it("loads Cashfree in production mode and opens checkout", async () => {
    await openCashfreeCheckout({
      paymentSessionId: "session_live",
      cashfreeMode: "production",
    });

    expect(load).toHaveBeenCalledWith({ mode: "production" });
    expect(checkoutMock).toHaveBeenCalledWith({
      paymentSessionId: "session_live",
      redirectTarget: "_self",
    });
  });

  it("opens checkout from checkoutUrl when paymentSessionId is missing", async () => {
    await openCashfreeCheckout({
      checkoutUrl: "https://payments.cashfree.com/order/#session_from_url",
    });

    expect(checkoutMock).toHaveBeenCalledWith({
      paymentSessionId: "session_from_url",
      redirectTarget: "_self",
    });
  });

  it("surfaces Cashfree checkout errors", async () => {
    checkoutMock.mockResolvedValue({
      error: { message: "client session is invalid" },
    });

    await expect(
      openCashfreeCheckout({
        paymentSessionId: "session_bad",
        cashfreeMode: "sandbox",
      }),
    ).rejects.toThrow("client session is invalid");
  });
});
