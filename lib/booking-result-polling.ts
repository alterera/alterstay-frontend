export const BOOKING_RESULT_POLL_INTERVAL_MS = 2000;
/** Switch from spinner to “still confirming” copy. */
export const BOOKING_RESULT_AUTO_POLL_MAX_MS = 60_000;
/** Stop waiting for gateway confirmation and show timeout / retry UI. */
export const BOOKING_RESULT_PAYMENT_WAIT_MAX_MS = 3 * 60_000;

export function shouldEnterStillProcessing(
  startedAtMs: number,
  nowMs: number,
): boolean {
  return nowMs - startedAtMs >= BOOKING_RESULT_AUTO_POLL_MAX_MS;
}

export function shouldGiveUpWaitingForPayment(
  startedAtMs: number,
  nowMs: number,
): boolean {
  return nowMs - startedAtMs >= BOOKING_RESULT_PAYMENT_WAIT_MAX_MS;
}

export function isHoldExpired(
  holdExpiresAt: string | null,
  nowMs: number = Date.now(),
): boolean {
  if (!holdExpiresAt) return false;
  return new Date(holdExpiresAt).getTime() <= nowMs;
}

export function shouldStopAutoPolling(
  phase:
    | "loading"
    | "processing"
    | "still_processing"
    | "payment_timeout"
    | "success"
    | "failed"
    | "refund"
    | "expired"
    | "invalid"
    | "login_required",
): boolean {
  return (
    phase === "success" ||
    phase === "failed" ||
    phase === "refund" ||
    phase === "expired" ||
    phase === "invalid" ||
    phase === "login_required" ||
    phase === "still_processing" ||
    phase === "payment_timeout"
  );
}
