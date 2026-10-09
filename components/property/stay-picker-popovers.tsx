"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  StayDatesPicker,
  StayGuestsPicker,
} from "./stay-picker-content";
import type { DateRange, GuestCounts } from "@/types/search";

type StayDatesPopoverProps = {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  trigger: React.ReactElement;
  align?: "start" | "center" | "end";
  compact?: boolean;
};

export function StayDatesPopover({
  dateRange,
  onChange,
  trigger,
  align = "start",
  compact = true,
}: StayDatesPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        className="w-auto max-w-[min(calc(100vw-1rem),17.5rem)] p-0"
      >
        <StayDatesPicker
          dateRange={dateRange}
          onChange={onChange}
          onComplete={() => setOpen(false)}
          compact={compact}
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
  compact?: boolean;
};

export function StayGuestsPopover({
  guests,
  onChange,
  trigger,
  align = "start",
  compact = true,
}: StayGuestsPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        className="w-[min(calc(100vw-2rem),16.5rem)] max-w-[calc(100vw-2rem)] p-2.5"
      >
        <StayGuestsPicker
          guests={guests}
          onChange={onChange}
          onComplete={() => setOpen(false)}
          compact={compact}
        />
      </PopoverContent>
    </Popover>
  );
}
