"use client";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatCompactDateRange,
  getStayNights,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

import { PropertyStayControls } from "./property-stay-controls";

type PropertyBookingPanelProps = {
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  currency: string;
  quoteLoading?: boolean;
  quoteAvailable?: boolean;
  onSearchUpdate: (search: PropertySearchParams) => void;
  onChooseRoom: () => void;
  onBookNow: () => void;
  className?: string;
};

export function PropertyBookingPanel({
  search,
  selectedPlan,
  currency,
  quoteLoading = false,
  quoteAvailable = true,
  onSearchUpdate,
  onChooseRoom,
  onBookNow,
  className,
}: PropertyBookingPanelProps) {
  const nights = getStayNights(search.dateRange);
  const roomTotal = selectedPlan?.totalPrice ?? 0;
  const taxes = selectedPlan?.estimatedTaxes ?? 0;
  const displayCurrency = selectedPlan?.currency ?? currency;

  return (
    <aside className={cn("hidden lg:block lg:self-stretch", className)}>
      <div className="sticky top-36 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="space-y-1">
          {selectedPlan ? (
            <>
              <p className="text-2xl font-bold tracking-tight">
                {formatCurrency(selectedPlan.pricePerNight, displayCurrency)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / night
                </span>
              </p>
              {taxes > 0 ? (
                <p className="text-xs text-muted-foreground">
                  +{formatCurrency(taxes, displayCurrency)} taxes
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Price on request</p>
          )}
          {nights > 0 ? (
            <p className="text-xs text-muted-foreground">
              {nights} night{nights === 1 ? "" : "s"} ·{" "}
              {formatCompactDateRange(search.dateRange)}
            </p>
          ) : null}
        </div>

        <PropertyStayControls
          search={search}
          onUpdate={onSearchUpdate}
          className="mt-4"
        />

        <button
          type="button"
          onClick={onChooseRoom}
          className="mt-4 flex w-full items-center justify-between rounded-xl border bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/40"
        >
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
              Room type
            </span>
            {selectedPlan ? (
              <>
                <span className="block truncate text-sm font-semibold">
                  {selectedPlan.roomTypeName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {selectedPlan.ratePlanName}
                </span>
              </>
            ) : (
              <span className="block text-sm font-medium text-muted-foreground">
                Select a room
              </span>
            )}
          </span>
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>

        {selectedPlan ? (
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Room total</span>
              <span className="font-medium">
                {formatCurrency(roomTotal, displayCurrency)}
              </span>
            </div>
            {taxes > 0 ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span className="font-medium">
                  {formatCurrency(taxes, displayCurrency)}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(roomTotal + taxes, displayCurrency)}</span>
            </div>
          </div>
        ) : null}

        <Button
          type="button"
          disabled={!selectedPlan || quoteLoading || !quoteAvailable}
          onClick={onBookNow}
          className="mt-5 w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {quoteLoading
            ? "Checking availability…"
            : !quoteAvailable
              ? "Unavailable"
              : "Book Now"}
        </Button>
      </div>
    </aside>
  );
}
