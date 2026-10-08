"use client";

import { useMemo } from "react";
import { BedDoubleIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProductGuestLabel } from "@/lib/rate-products";
import { planToSelection, sortRoomTypesByPriceAsc } from "@/lib/property-booking";
import { formatCurrency, getStayNights } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  PropertyRatePlanDetail,
  PropertyRoomTypeDetail,
  SelectedRoomPlan,
} from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

const ROOM_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800";

type PropertyRoomSelectionMobileProps = {
  roomTypes: PropertyRoomTypeDetail[];
  currency: string;
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  onSelectPlan: (plan: SelectedRoomPlan) => void;
};

function planBullets(plan: PropertyRatePlanDetail) {
  const bullets: string[] = [];
  const mealCode = plan.mealPlan?.code ?? "ROOM_ONLY";
  if (mealCode === "ROOM_ONLY") {
    bullets.push("No Meals");
  } else if (mealCode === "BREAKFAST") {
    bullets.push("Breakfast included");
  } else {
    bullets.push(plan.mealPlan?.name ?? "Meals included");
  }
  bullets.push(plan.isRefundable === false ? "Non Refundable" : "Free cancellation");
  return bullets;
}

function compareStrikePrice(
  roomType: PropertyRoomTypeDetail,
  plan: PropertyRatePlanDetail,
): number | null {
  if (plan.isRefundable !== false || !plan.pricePerNight) return null;
  const refundable = roomType.ratePlans.find(
    (item) =>
      item.isRefundable !== false &&
      item.mealPlan?.code === plan.mealPlan?.code &&
      item.id !== plan.id,
  );
  if (
    refundable?.pricePerNight &&
    refundable.pricePerNight > plan.pricePerNight
  ) {
    return refundable.pricePerNight;
  }
  const epRefundable = roomType.ratePlans.find(
    (item) => item.productCode === "EP_REFUNDABLE",
  );
  if (
    epRefundable?.pricePerNight &&
    epRefundable.pricePerNight > plan.pricePerNight
  ) {
    return epRefundable.pricePerNight;
  }
  return null;
}

function gstPerNight(plan: PropertyRatePlanDetail, nights: number): number | null {
  if (!plan.estimatedGst && !plan.estimatedTaxes) return null;
  const gst = plan.estimatedGst ?? plan.estimatedTaxes ?? 0;
  if (gst <= 0) return null;
  const divisor = nights > 0 ? nights : 1;
  return Math.round(gst / divisor);
}

type RatePlanCardProps = {
  plan: PropertyRatePlanDetail;
  roomType: PropertyRoomTypeDetail;
  currency: string;
  nights: number;
  isSelected: boolean;
  onSelect: () => void;
};

function RatePlanCard({
  plan,
  roomType,
  currency,
  nights,
  isSelected,
  onSelect,
}: RatePlanCardProps) {
  const label =
    plan.guestLabel ?? getProductGuestLabel(plan.productCode, plan.name);
  const title = plan.name || label.split("·")[0]?.trim() || "Room Only";
  const strike = compareStrikePrice(roomType, plan);
  const gstNight = gstPerNight(plan, nights);

  return (
    <article
      className={cn(
        "flex w-[min(calc(100vw-2rem),280px)] shrink-0 snap-start snap-always flex-col rounded-md border bg-white p-3",
        isSelected && "border-brand ring-1 ring-brand/30",
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
        {planBullets(plan).map((line) => (
          <li key={line} className="flex gap-1.5">
            <span className="text-foreground/50">•</span>
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-1 flex-col justify-end gap-1">
        {plan.pricePerNight !== null ? (
          <>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold">
                {formatCurrency(plan.pricePerNight, currency)}
              </p>
              {strike ? (
                <p className="text-xs text-muted-foreground line-through">
                  {formatCurrency(strike, currency)}
                </p>
              ) : null}
            </div>
            {gstNight ? (
              <p className="text-[11px] text-muted-foreground">
                + {formatCurrency(gstNight, currency)} GST per night
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Select dates for pricing</p>
        )}
        <Button
          type="button"
          variant={isSelected ? "default" : "outline"}
          className={cn(
            "mt-2 h-9 w-full rounded-md text-sm",
            isSelected
              ? "bg-brand text-brand-foreground hover:bg-brand/90"
              : "border-brand text-brand hover:bg-brand/5",
          )}
          disabled={plan.pricePerNight === null}
          onClick={onSelect}
        >
          {isSelected ? "Selected" : "Select"}
        </Button>
      </div>
    </article>
  );
}

export function PropertyRoomSelectionMobile({
  roomTypes,
  currency,
  search,
  selectedPlan,
  onSelectPlan,
}: PropertyRoomSelectionMobileProps) {
  const nights = getStayNights(search.dateRange);
  const sortedRoomTypes = useMemo(
    () => sortRoomTypesByPriceAsc(roomTypes),
    [roomTypes],
  );
  if (sortedRoomTypes.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        No rooms available for the selected dates.
      </p>
    );
  }

  return (
    <div className="space-y-8 pb-2">
      {sortedRoomTypes.map((roomType, index) => {
        const isRoomHighlighted =
          selectedPlan?.roomTypeId === roomType.id ||
          roomType.ratePlans.some(
            (plan) => plan.id === selectedPlan?.ratePlanId,
          );
        const roomImage = roomType.imageUrls[0] ?? ROOM_IMAGE_FALLBACK;
        const roomsAvailable = roomType.roomsAvailable;
        const showUrgency =
          roomsAvailable != null &&
          roomsAvailable > 0 &&
          roomsAvailable < 9;

        return (
          <section
            key={roomType.id}
            id={`room-type-${roomType.id}`}
            className="space-y-3 px-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                className={cn(
                  "text-lg font-bold leading-tight tracking-tight",
                  isRoomHighlighted
                    ? "text-brand"
                    : "text-foreground",
                )}
              >
                {roomType.name}
              </h3>
              {showUrgency ? (
                <p className="shrink-0 text-right text-[11px] font-medium text-brand">
                  {roomsAvailable} room{roomsAvailable === 1 ? "" : "s"} left,
                  hurry!
                </p>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-md border bg-muted/20">
              <div className="flex gap-0">
                <div className="relative h-32 w-[58%] shrink-0 overflow-hidden bg-muted sm:h-36">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={roomImage}
                    alt={roomType.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2 font-medium text-foreground">
                    <UsersIcon className="size-4 text-brand" />
                    Max {roomType.maxOccupancy}
                  </span>
                  {roomType.bedType ? (
                    <span className="inline-flex items-center gap-2 font-medium text-foreground">
                      <BedDoubleIcon className="size-4 text-brand" />
                      {roomType.bedType}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div
              className={cn(
                "-mx-4 overflow-x-auto pb-1",
                "snap-x snap-mandatory scroll-pl-4 scroll-pr-4",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              <div className="flex w-max gap-3 pl-4 pr-4">
                {roomType.ratePlans.map((plan) => (
                  <RatePlanCard
                    key={plan.id}
                    plan={plan}
                    roomType={roomType}
                    currency={currency}
                    nights={nights}
                    isSelected={selectedPlan?.ratePlanId === plan.id}
                    onSelect={() => {
                      const selection = planToSelection(roomType, plan.id);
                      if (selection) onSelectPlan(selection);
                    }}
                  />
                ))}
              </div>
            </div>

            {index < sortedRoomTypes.length - 1 ? (
              <div className="border-b" />
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
