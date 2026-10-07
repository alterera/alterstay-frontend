"use client";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency, getStayNights } from "@/lib/format";
import {
  calculateMemberSavingsFromTotal,
  grandTotalFromSource,
} from "@/lib/property-fees";
import type { SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

import { PropertyBookingLegalFooter } from "./property-booking-legal-footer";
import { PropertyMemberLoginBanner } from "./property-member-login-banner";

type CancellationPolicy = {
  name: string;
  description: string;
} | null;

type PropertyRoomSelectionDockProps = {
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  currency: string;
  quoteLoading?: boolean;
  quoteAvailable?: boolean;
  cancellationPolicy?: CancellationPolicy;
  onReserve: () => void;
};

export function PropertyRoomSelectionDock({
  search,
  selectedPlan,
  currency,
  quoteLoading = false,
  quoteAvailable = true,
  cancellationPolicy = null,
  onReserve,
}: PropertyRoomSelectionDockProps) {
  const nights = getStayNights(search.dateRange);
  const displayCurrency = selectedPlan?.currency ?? currency;
  const grandTotal = selectedPlan ? grandTotalFromSource(selectedPlan) : 0;
  const memberSavings = calculateMemberSavingsFromTotal(grandTotal);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden">
      <div className="overflow-hidden rounded-xl border bg-white shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
        {selectedPlan ? (
          <PropertyMemberLoginBanner
            savingsAmount={memberSavings}
            currency={displayCurrency}
            className="rounded-none"
          />
        ) : null}

        <div className="px-4 py-3">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <div className="min-w-0 flex-1">
              {selectedPlan ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold tracking-tight">
                      {formatCurrency(grandTotal, displayCurrency)}
                    </p>
                    {nights > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        for {nights} night{nights === 1 ? "" : "s"}
                      </p>
                    ) : null}
                  </div>
                  <p className="truncate text-sm font-medium">
                    {selectedPlan.roomTypeName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selectedPlan.ratePlanName}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  Select a room to book
                </p>
              )}
            </div>

            <Button
              type="button"
              disabled={!selectedPlan || quoteLoading || !quoteAvailable}
              onClick={onReserve}
              className="h-11 shrink-0 rounded-md bg-brand px-7 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
            >
              {quoteLoading
                ? "Checking…"
                : !quoteAvailable
                  ? "Unavailable"
                  : "Reserve"}
              {!quoteLoading && quoteAvailable ? (
                <ChevronRightIcon className="size-4" />
              ) : null}
            </Button>
          </div>

          <PropertyBookingLegalFooter
            cancellationPolicy={cancellationPolicy}
            compact
            className="mt-3 border-t pt-3"
          />
        </div>
      </div>
    </div>
  );
}
