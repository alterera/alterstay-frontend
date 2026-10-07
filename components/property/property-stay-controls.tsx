"use client";

import { CalendarIcon, UsersIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  formatCompactDateRange,
  formatGuestSummary,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/search";

import {
  StayDatesPopover,
  StayGuestsPopover,
} from "./stay-picker-popovers";

type PropertyStayControlsProps = {
  search: PropertySearchParams;
  onUpdate: (search: PropertySearchParams) => void;
  className?: string;
  compact?: boolean;
};

export function PropertyStayControls({
  search,
  onUpdate,
  className,
  compact = false,
}: PropertyStayControlsProps) {
  return (
    <div className={className}>
      <div
        className={cn(
          "overflow-hidden border bg-muted/30",
          compact ? "rounded-lg" : "rounded-xl",
        )}
      >
        <StayDatesPopover
          dateRange={search.dateRange}
          onChange={(dateRange) => onUpdate({ ...search, dateRange })}
          trigger={
            <button
              type="button"
              className={cn(
                "flex w-full items-center text-left transition-colors hover:bg-muted/50",
                compact
                  ? "gap-2 px-3 py-2"
                  : "items-start gap-3 px-4 py-3",
              )}
            >
              <CalendarIcon
                className={cn(
                  "shrink-0 text-muted-foreground",
                  compact ? "size-3.5" : "mt-0.5 size-4",
                )}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block uppercase tracking-wide text-muted-foreground",
                    compact ? "text-[10px]" : "text-[11px]",
                  )}
                >
                  Dates
                </span>
                <span
                  className={cn(
                    "block font-medium",
                    compact ? "text-xs" : "text-sm",
                  )}
                >
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
              className={cn(
                "flex w-full items-center text-left transition-colors hover:bg-muted/50",
                compact
                  ? "gap-2 px-3 py-2"
                  : "items-start gap-3 px-4 py-3",
              )}
            >
              <UsersIcon
                className={cn(
                  "shrink-0 text-muted-foreground",
                  compact ? "size-3.5" : "mt-0.5 size-4",
                )}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block uppercase tracking-wide text-muted-foreground",
                    compact ? "text-[10px]" : "text-[11px]",
                  )}
                >
                  Guests
                </span>
                <span
                  className={cn(
                    "block font-medium",
                    compact ? "text-xs" : "text-sm",
                  )}
                >
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
