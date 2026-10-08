"use client";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency, getStayNights } from "@/lib/format";
import { feeBreakupFromSource } from "@/lib/property-fees";
import type { SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

import { PropertyTaxesFeesInfo } from "./property-taxes-fees-info";

type PropertyRoomSelectionDockProps = {
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  currency: string;
  quoteLoading?: boolean;
  quoteAvailable?: boolean;
  onReserve: () => void;
};

export function PropertyRoomSelectionDock({
  search,
  selectedPlan,
  currency,
  quoteLoading = false,
  quoteAvailable = true,
  onReserve,
}: PropertyRoomSelectionDockProps) {
  const nights = getStayNights(search.dateRange);
  const displayCurrency = selectedPlan?.currency ?? currency;
  const feeBreakup = selectedPlan ? feeBreakupFromSource(selectedPlan) : null;
  const nightLabel = nights > 0 ? nights : 1;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
      <div className="mx-auto max-w-6xl px-4 py-2.5">
        {selectedPlan ? (
          <div className="grid grid-cols-[1fr_auto] grid-rows-2 items-center gap-x-3 gap-y-0.5">
            <div className="min-w-0">
              <p className="text-xl font-bold leading-none tracking-tight">
                {formatCurrency(selectedPlan.pricePerNight, displayCurrency)}
                <span className="text-xs font-normal text-muted-foreground">
                  /{nightLabel} night{nightLabel === 1 ? "" : "s"}
                </span>
              </p>
            </div>
            <Button
              type="button"
              disabled={quoteLoading || !quoteAvailable}
              onClick={onReserve}
              className="row-span-2 h-10 shrink-0 self-center rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
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
            {feeBreakup && feeBreakup.taxesAndFees > 0 ? (
              <p className="-mt-0.5 flex items-center gap-1 text-[11px] leading-tight text-muted-foreground">
                +{formatCurrency(feeBreakup.taxesAndFees, displayCurrency)}{" "}
                Taxes &amp; Fees
                <PropertyTaxesFeesInfo
                  breakup={feeBreakup}
                  currency={displayCurrency}
                  compact
                />
              </p>
            ) : (
              <span className="block" aria-hidden />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Select a room to book
            </p>
            <Button
              type="button"
              disabled
              className="h-10 shrink-0 rounded-md px-4 text-sm font-semibold"
            >
              Reserve
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
