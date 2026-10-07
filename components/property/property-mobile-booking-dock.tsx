"use client";

import { ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PropertyDetail } from "@/types/property-detail";

type PropertyMobileBookingDockProps = {
  property: PropertyDetail;
  onSelectRoom: () => void;
};

export function PropertyMobileBookingDock({
  property,
  onSelectRoom,
}: PropertyMobileBookingDockProps) {
  const roomTypeCount = property.roomTypes.length;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden">
      <div className="rounded-xl border bg-white px-4 py-3 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {roomTypeCount > 0
                ? `${roomTypeCount} room type${roomTypeCount === 1 ? "" : "s"} available`
                : "No rooms available"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Choose your stay option to continue
            </p>
          </div>

          <Button
            type="button"
            disabled={roomTypeCount === 0}
            onClick={onSelectRoom}
            className="h-11 shrink-0 rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
          >
            Select room
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
