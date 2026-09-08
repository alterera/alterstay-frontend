"use client";

import { useEffect, useState } from "react";
import type { DateRange as DayPickerDateRange } from "react-day-picker";

import { GuestsPickerContent } from "@/components/sections/hero/guests-picker-content";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { nextDateRangeForDay, startOfToday } from "@/lib/date-range";
import type { DateRange, GuestCounts } from "@/types/search";

type StayDatesPickerProps = {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  onComplete?: () => void;
  className?: string;
};

export function StayDatesPicker({
  dateRange,
  onChange,
  onComplete,
  className,
}: StayDatesPickerProps) {
  const [draft, setDraft] = useState(dateRange);
  const today = startOfToday();

  useEffect(() => {
    setDraft(dateRange);
  }, [dateRange]);

  function handleSelect(_range: DayPickerDateRange | undefined, triggerDate: Date) {
    const next = nextDateRangeForDay(draft, triggerDate);
    setDraft(next);

    if (next.from && next.to) {
      onChange(next);
      onComplete?.();
    }
  }

  return (
    <Calendar
      mode="range"
      selected={draft}
      onSelect={handleSelect}
      numberOfMonths={2}
      defaultMonth={draft.from ?? dateRange.from ?? today}
      disabled={{ before: today }}
      className={className ?? "p-3 md:[--cell-size:--spacing(9)]"}
    />
  );
}

type StayGuestsPickerProps = {
  guests: GuestCounts;
  onChange: (guests: GuestCounts) => void;
  onComplete?: () => void;
};

export function StayGuestsPicker({
  guests,
  onChange,
  onComplete,
}: StayGuestsPickerProps) {
  const [draft, setDraft] = useState(guests);

  useEffect(() => {
    setDraft(guests);
  }, [guests]);

  function applyGuests() {
    onChange({ ...draft, children: 0 });
    onComplete?.();
  }

  return (
    <div>
      <GuestsPickerContent value={draft} onChange={setDraft} />
      <Button
        type="button"
        className="mt-4 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
        onClick={applyGuests}
      >
        Done
      </Button>
    </div>
  );
}
