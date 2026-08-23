"use client";

import { useState } from "react";
import type { DateRange as DayPickerDateRange } from "react-day-picker";

import { GuestsPickerContent } from "@/components/sections/hero/guests-picker-content";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { nextDateRangeForDay, startOfToday } from "@/lib/date-range";
import type { DateRange, GuestCounts } from "@/types/search";

type StayDatesPopoverProps = {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  trigger: React.ReactElement;
  align?: "start" | "center" | "end";
};

export function StayDatesPopover({
  dateRange,
  onChange,
  trigger,
  align = "start",
}: StayDatesPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(dateRange);
  const today = startOfToday();

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(dateRange);
    }
    setOpen(nextOpen);
  }

  function handleSelect(_range: DayPickerDateRange | undefined, triggerDate: Date) {
    const next = nextDateRangeForDay(draft, triggerDate);
    setDraft(next);

    // Commit only once check-in and check-out are both chosen so we do not
    // push a partial range to the URL and reload the property mid-selection.
    if (next.from && next.to) {
      onChange(next);
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        className="w-auto max-w-[calc(100vw-1rem)] p-0"
      >
        <Calendar
          mode="range"
          selected={draft}
          onSelect={handleSelect}
          numberOfMonths={2}
          defaultMonth={draft.from ?? dateRange.from ?? today}
          disabled={{ before: today }}
          className="p-3 md:[--cell-size:--spacing(9)]"
        />
      </PopoverContent>
    </Popover>
  );
}

type StayGuestsPopoverProps = {
  guests: GuestCounts;
  onChange: (guests: GuestCounts) => void;
  trigger: React.ReactElement;
  align?: "start" | "center" | "end";
};

export function StayGuestsPopover({
  guests,
  onChange,
  trigger,
  align = "start",
}: StayGuestsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(guests);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(guests);
    }
    setOpen(nextOpen);
  }

  function applyGuests() {
    onChange({ ...draft, children: 0 });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align={align} className="w-[min(100vw-2rem,320px)] p-4">
        <GuestsPickerContent value={draft} onChange={setDraft} />
        <Button
          type="button"
          className="mt-4 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={applyGuests}
        >
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
