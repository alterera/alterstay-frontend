"use client";

import { CalendarIcon, UsersIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  formatCompactDateRange,
  formatGuestSummary,
} from "@/lib/format";
import type { PropertySearchParams } from "@/types/search";

import {
  StayDatesPopover,
  StayGuestsPopover,
} from "./stay-picker-popovers";

type PropertyStayControlsProps = {
  search: PropertySearchParams;
  onUpdate: (search: PropertySearchParams) => void;
  className?: string;
};

export function PropertyStayControls({
  search,
  onUpdate,
  className,
}: PropertyStayControlsProps) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border bg-muted/30">
        <StayDatesPopover
          dateRange={search.dateRange}
          onChange={(dateRange) => onUpdate({ ...search, dateRange })}
          trigger={
            <button
              type="button"
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <CalendarIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                  Dates
                </span>
                <span className="block text-sm font-medium">
                  {formatCompactDateRange(search.dateRange)}
                </span>
              </span>
            </button>
          }
        />

        <Separator />

        <StayGuestsPopover
          guests={search.guests}
          onChange={(guests) => onUpdate({ ...search, guests })}
          trigger={
            <button
              type="button"
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <UsersIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                  Guests
                </span>
                <span className="block text-sm font-medium">
                  {formatGuestSummary(search.guests)}
                </span>
              </span>
            </button>
          }
        />
      </div>
    </div>
  );
}
