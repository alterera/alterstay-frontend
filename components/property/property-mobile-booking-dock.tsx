"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency, getStayNights } from "@/lib/format";
import type { SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

type PropertyMobileBookingDockProps = {
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  currency: string;
  onBookNow: () => void;
};

export function PropertyMobileBookingDock({
  search,
  selectedPlan,
  currency,
  onBookNow,
}: PropertyMobileBookingDockProps) {
  const nights = getStayNights(search.dateRange);
  const taxes = selectedPlan?.estimatedTaxes ?? 0;
  const total = (selectedPlan?.totalPrice ?? 0) + taxes;
  const displayCurrency = selectedPlan?.currency ?? currency;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="border-t bg-white px-4 py-3 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1">
            {selectedPlan ? (
              <>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold tracking-tight">
                    {formatCurrency(total, displayCurrency)}
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
              <p className="text-sm text-muted-foreground">
                Select dates to see room prices
              </p>
            )}
          </div>

          <Button
            type="button"
            disabled={!selectedPlan}
            onClick={onBookNow}
            className="h-11 shrink-0 rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
