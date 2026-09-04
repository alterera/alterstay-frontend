import { isSameDay } from "date-fns";

import { formatNavDateRange, getStayNights } from "@/lib/format";
import type { DateRange } from "@/types/search";

export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Booking-style range picking:
 * 1. First tap → check-in (check-out cleared)
 * 2. Later day → check-out
 * 3. Same day as check-in, or an earlier day → move check-in
 * 4. Tap anywhere after a complete range → start a new check-in
 *
 * Check-out must be after check-in (minimum one night).
 */
export function nextDateRangeForDay(current: DateRange, day: Date): DateRange {
  const rangeComplete = Boolean(current.from && current.to);

  if (!current.from || rangeComplete) {
    return { from: day, to: undefined };
  }

  if (
    isSameDay(day, current.from) ||
    day.getTime() < current.from.getTime()
  ) {
    return { from: day, to: undefined };
  }

  return { from: current.from, to: day };
}

/** Sheet footer copy that also doubles as selection feedback. */
export function describeDateRange(range: DateRange): string {
  if (!range.from) {
    return "Select your check-in date";
  }

  if (!range.to) {
    return `Check-in ${formatNavDateRange(range)} — now pick check-out`;
  }

  const nights = getStayNights(range);
  return `${formatNavDateRange(range)} · ${nights} ${nights === 1 ? "night" : "nights"}`;
}
