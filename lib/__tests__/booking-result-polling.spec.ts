import { describe, expect, it } from "vitest";

import {
  BOOKING_RESULT_AUTO_POLL_MAX_MS,
  shouldEnterStillProcessing,
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

  it("stops auto polling for terminal and still-processing phases", () => {
    expect(shouldStopAutoPolling("success")).toBe(true);
    expect(shouldStopAutoPolling("still_processing")).toBe(true);
    expect(shouldStopAutoPolling("processing")).toBe(false);
  });
});
