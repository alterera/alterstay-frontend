"use client";

import { useMemo } from "react";

import { Calendar } from "@/components/ui/calendar";
import { startOfToday } from "@/lib/date-range";
import type { DateRange } from "@/types/search";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** A rolling year is enough runway for hotel stays and keeps the DOM small. */
const SCROLLABLE_MONTHS = 12;

type DateRangeSheetCalendarProps = {
  value: DateRange;
  onDayClick: (day: Date) => void;
  className?: string;
};

/** Weekday row rendered once above the scrolling months. */
export function DateRangeWeekdayHeader({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid grid-cols-7 text-center", className)}
    >
      {WEEKDAY_LABELS.map((label) => (
        <span key={label} className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      ))}
    </div>
  );
}

export function DateRangeSheetCalendar({
  value,
  onDayClick,
  className,
}: DateRangeSheetCalendarProps) {
  const today = useMemo(() => startOfToday(), []);

  return (
    <Calendar
      mode="range"
      selected={value}
      numberOfMonths={SCROLLABLE_MONTHS}
      defaultMonth={today}
      disabled={{ before: today }}
      // Only the tapped day is used: react-day-picker's own range result would
      // set check-out on the very first tap. Passing `onSelect` at all is also
      // what keeps `selected` controlled rather than internal to the library.
      onSelect={(_range, triggerDate) => onDayClick(triggerDate)}
      classNames={{
        nav: "hidden",
        weekdays: "hidden",
        month_caption:
          "flex h-10 w-full items-center justify-center text-base font-semibold",
      }}
      className={cn(
        // Cells must stay narrow enough that 7 of them fit a 320px viewport.
        "w-full p-0 [--cell-size:--spacing(10)] [&_.rdp-months]:flex-col [&_.rdp-months]:gap-6",
        className,
      )}
    />
  );
}
