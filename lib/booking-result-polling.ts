export const BOOKING_RESULT_POLL_INTERVAL_MS = 2000;
export const BOOKING_RESULT_AUTO_POLL_MAX_MS = 60_000;

export function shouldEnterStillProcessing(
  startedAtMs: number,
  nowMs: number,
): boolean {
  return nowMs - startedAtMs >= BOOKING_RESULT_AUTO_POLL_MAX_MS;
}

export function shouldStopAutoPolling(
  phase: "loading" | "processing" | "still_processing" | "success" | "failed" | "refund" | "expired" | "invalid" | "login_required",
): boolean {
  return (
    phase === "success" ||
    phase === "failed" ||
    phase === "refund" ||
    phase === "expired" ||
    phase === "invalid" ||
    phase === "login_required" ||
    phase === "still_processing"
  );
}
