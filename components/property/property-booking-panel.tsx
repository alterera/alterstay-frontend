"use client";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatCompactDateRange,
  getStayNights,
} from "@/lib/format";
import {
  calculateMemberSavings,
  calculatePropertyFeeBreakup,
} from "@/lib/property-fees";
import { cn } from "@/lib/utils";
import type { SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

import { PropertyBookingLegalFooter } from "./property-booking-legal-footer";
import { PropertyMemberLoginBanner } from "./property-member-login-banner";
import { PropertyPriceBreakup } from "./property-price-breakup";
import { PropertyStayControls } from "./property-stay-controls";
import { PropertyTaxesFeesInfo } from "./property-taxes-fees-info";

type CancellationPolicy = {
  name: string;
  description: string;
} | null;

type PropertyBookingPanelProps = {
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  currency: string;
  quoteLoading?: boolean;
  quoteAvailable?: boolean;
  cancellationPolicy?: CancellationPolicy;
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
  cancellationPolicy = null,
  onSearchUpdate,
  onChooseRoom,
  onBookNow,
  className,
}: PropertyBookingPanelProps) {
  const nights = getStayNights(search.dateRange);
  const roomTotal = selectedPlan?.totalPrice ?? 0;
  const displayCurrency = selectedPlan?.currency ?? currency;
  const feeBreakup = calculatePropertyFeeBreakup(roomTotal);
  const memberSavings = calculateMemberSavings(roomTotal);

  return (
    <aside className={cn("hidden lg:block lg:self-stretch", className)}>
      <div className="sticky top-20 overflow-hidden rounded-md border bg-white">
        {selectedPlan ? (
          <PropertyMemberLoginBanner
            savingsAmount={memberSavings}
            currency={displayCurrency}
            className="py-2 text-[10px]"
          />
        ) : null}

        <div className="space-y-3 p-4">
          <div className="space-y-0.5">
            {selectedPlan ? (
              <>
                <p className="text-xl font-bold tracking-tight">
                  {formatCurrency(selectedPlan.pricePerNight, displayCurrency)}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / night
                  </span>
                </p>
                {roomTotal > 0 ? (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <span>
                      +{formatCurrency(feeBreakup.taxesAndFees, displayCurrency)}{" "}
                      taxes and fees
                    </span>
                    <PropertyTaxesFeesInfo
                      breakup={feeBreakup}
                      currency={displayCurrency}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Price on request</p>
            )}
            {nights > 0 ? (
              <p className="text-[11px] text-muted-foreground">
                {nights} night{nights === 1 ? "" : "s"} ·{" "}
                {formatCompactDateRange(search.dateRange)}
              </p>
            ) : null}
          </div>

          <PropertyStayControls
            search={search}
            onUpdate={onSearchUpdate}
            compact
          />

          <button
            type="button"
            onClick={onChooseRoom}
            className="flex w-full items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-left transition-colors hover:bg-muted/40"
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                Room type
              </span>
              {selectedPlan ? (
                <>
                  <span className="block truncate text-xs font-semibold">
                    {selectedPlan.roomTypeName}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {selectedPlan.ratePlanName}
                  </span>
                </>
              ) : (
                <span className="block text-xs font-medium text-muted-foreground">
                  Select a room
                </span>
              )}
            </span>
            <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
          </button>

          {selectedPlan ? (
            <div className="border-t pt-3">
              <PropertyPriceBreakup
                className="border-0 bg-transparent p-0"
                roomTotal={roomTotal}
                currency={displayCurrency}
                compact
              />
            </div>
          ) : null}

          <Button
            type="button"
            disabled={!selectedPlan || quoteLoading || !quoteAvailable}
            onClick={onBookNow}
            className="h-10 w-full rounded-md bg-brand text-sm text-white hover:bg-brand/90 cursor-pointer"
          >
            {quoteLoading
              ? "Checking availability…"
              : !quoteAvailable
                ? "Unavailable"
                : "Book Now"}
          </Button>

          <PropertyBookingLegalFooter
            cancellationPolicy={cancellationPolicy}
            className="border-t pt-3"
            compact
          />
        </div>
      </div>
    </aside>
  );
}
