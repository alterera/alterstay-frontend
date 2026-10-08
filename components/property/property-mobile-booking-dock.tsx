"use client";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { PropertyDetail } from "@/types/property-detail";
import { getPropertyMinPricePerNight } from "@/lib/property-booking";

type PropertyMobileBookingDockProps = {
  property: PropertyDetail;
  onSelectRoom: () => void;
};

export function PropertyMobileBookingDock({
  property,
  onSelectRoom,
}: PropertyMobileBookingDockProps) {
  const minPrice = getPropertyMinPricePerNight(property);
  const hasRooms = property.roomTypes.length > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          {minPrice != null ? (
            <>
              <p className="text-base font-bold leading-tight tracking-tight">
                {formatCurrency(minPrice, property.currency)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  / night
                </span>
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                Lowest available rate
              </p>
            </>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              {hasRooms ? "Select dates for pricing" : "No rooms available"}
            </p>
          )}
        </div>

        <Button
          type="button"
          disabled={!hasRooms}
          onClick={onSelectRoom}
          className="h-10 shrink-0 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          Select room
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
