import { describe, expect, it } from "vitest";

import {
  BOOKING_RESULT_AUTO_POLL_MAX_MS,
  BOOKING_RESULT_PAYMENT_WAIT_MAX_MS,
  isHoldExpired,
  shouldEnterStillProcessing,
  shouldGiveUpWaitingForPayment,
  shouldStopAutoPolling,
} from "@/lib/booking-result-polling";

describe("booking-result-polling", () => {
  it("enters still-processing after 60 seconds", () => {
    const started = 1_000;
    expect(
      shouldEnterStillProcessing(
        started,
        started + BOOKING_RESULT_AUTO_POLL_MAX_MS,
      ),
    ).toBe(true);
    expect(
      shouldEnterStillProcessing(
        started,
        started + BOOKING_RESULT_AUTO_POLL_MAX_MS - 1,
      ),
    ).toBe(false);
  });

  it("gives up waiting after the payment wait window", () => {
    const started = 1_000;
    expect(
      shouldGiveUpWaitingForPayment(
        started,
        started + BOOKING_RESULT_PAYMENT_WAIT_MAX_MS,
      ),
    ).toBe(true);
  });

  it("detects expired holds", () => {
    expect(isHoldExpired("2000-01-01T00:00:00.000Z", Date.UTC(2026, 0, 2))).toBe(
      true,
    );
    expect(isHoldExpired(null)).toBe(false);
  });

  it("stops auto polling for terminal phases", () => {
    expect(shouldStopAutoPolling("success")).toBe(true);
    expect(shouldStopAutoPolling("payment_timeout")).toBe(true);
    expect(shouldStopAutoPolling("still_processing")).toBe(true);
    expect(shouldStopAutoPolling("processing")).toBe(false);
  });
});
