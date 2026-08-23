import { isSameDay } from "date-fns";

import { formatNavDateRange, getStayNights } from "@/lib/format";
import type { DateRange } from "@/types/search";

export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Booking-style range picking: the first tap sets check-in and leaves check-out
 * empty, the next later day closes the range, and any tap on a finished range
 * starts a new one. Tapping check-in again or an earlier day moves check-in.
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
    return `${formatNavDateRange(range)} — Select check-out`;
  }

  const nights = getStayNights(range);
  return `${formatNavDateRange(range)}, ${nights} ${nights === 1 ? "night" : "nights"}`;
}
