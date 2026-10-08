"use client";

import { useMemo, useState } from "react";
import {
  BedDoubleIcon,
  CrownIcon,
  RulerIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductGuestLabel } from "@/lib/rate-products";
import { planToSelection, sortRoomTypesByPriceAsc } from "@/lib/property-booking";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  PropertyRoomTypeDetail,
  SelectedRoomPlan,
} from "@/types/property-detail";

const ROOM_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800";

type PropertyRoomListProps = {
  roomTypes: PropertyRoomTypeDetail[];
  currency: string;
  selectedPlan: SelectedRoomPlan | null;
  onSelectPlan: (plan: SelectedRoomPlan) => void;
  emptyMessage?: string;
  showRoomImages?: boolean;
};

function MembershipBenefitBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-brand/20 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent px-3 py-2.5 lg:gap-3 lg:px-4 lg:py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground lg:size-9">
        <CrownIcon className="size-3.5 lg:size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground lg:text-sm">
          Alterstay membership benefit
        </p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground lg:text-xs">
          Members earn coins on eligible stays and unlock exclusive member rates
          at checkout.
        </p>
      </div>
    </div>
  );
}

type RoomTypeCardProps = {
  roomType: PropertyRoomTypeDetail;
  currency: string;
  amenitiesExpanded: boolean;
  onToggleAmenities: () => void;
  selectedRatePlanId: string | null;
  onSelectPlan: (ratePlanId: string) => void;
  showRoomImage?: boolean;
};

function RoomTypeCard({
  roomType,
  currency,
  amenitiesExpanded,
  onToggleAmenities,
  selectedRatePlanId,
  onSelectPlan,
  showRoomImage = false,
}: RoomTypeCardProps) {
  const sizeLabel = roomType.sizeSqm
    ? `${Math.round(roomType.sizeSqm * 10.7639)}sq ft`
    : null;
  const roomImage = roomType.imageUrls[0] ?? ROOM_IMAGE_FALLBACK;

  return (
    <article className="overflow-hidden rounded-md border bg-white">
      <div className={cn("border-b", showRoomImage ? "p-0" : "px-4 py-3")}>
        {showRoomImage ? (
          <div className="flex gap-0 sm:gap-3">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden bg-muted sm:h-32 sm:w-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={roomImage}
                alt={roomType.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 px-3 py-2.5 sm:py-3">
              <h4 className="text-base font-semibold leading-tight">
                {roomType.name}
              </h4>
              <RoomMeta
                roomType={roomType}
                sizeLabel={sizeLabel}
                amenitiesExpanded={amenitiesExpanded}
                onToggleAmenities={onToggleAmenities}
              />
            </div>
          </div>
        ) : (
          <>
            <h4 className="text-lg font-semibold">{roomType.name}</h4>
            <RoomMeta
              roomType={roomType}
              sizeLabel={sizeLabel}
              amenitiesExpanded={amenitiesExpanded}
              onToggleAmenities={onToggleAmenities}
            />
          </>
        )}
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {roomType.ratePlans.map((plan, index) => {
          const isSelected = selectedRatePlanId === plan.id;
          const label =
            plan.guestLabel ??
            getProductGuestLabel(plan.productCode, plan.name);

          return (
            <div key={plan.id}>
              {index > 0 ? <Separator className="my-3" /> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold sm:text-base">{label}</p>
                </div>

                <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    {plan.pricePerNight !== null ? (
                      <>
                        <p className="text-lg font-bold sm:text-xl">
                          {formatCurrency(plan.pricePerNight, currency)}
                        </p>
                        {plan.estimatedTaxes ? (
                          <p className="text-[11px] text-muted-foreground sm:text-xs">
                            +{formatCurrency(plan.estimatedTaxes, currency)} taxes
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Select dates for pricing
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "min-w-24 rounded-md",
                      isSelected
                        ? "bg-brand text-brand-foreground hover:bg-brand/90"
                        : "border-brand text-brand hover:bg-brand/5",
                    )}
                    disabled={plan.pricePerNight === null}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function RoomMeta({
  roomType,
  sizeLabel,
  amenitiesExpanded,
  onToggleAmenities,
}: {
  roomType: PropertyRoomTypeDetail;
  sizeLabel: string | null;
  amenitiesExpanded: boolean;
  onToggleAmenities: () => void;
}) {
  return (
    <>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground sm:mt-2 sm:gap-x-4 sm:text-xs">
        <span className="inline-flex items-center gap-1">
          <UsersIcon className="size-3" />
          Max {roomType.maxOccupancy}
        </span>
        {roomType.bedType ? (
          <span className="inline-flex items-center gap-1">
            <BedDoubleIcon className="size-3" />
            {roomType.bedType}
          </span>
        ) : null}
        {sizeLabel ? (
          <span className="inline-flex items-center gap-1">
            <RulerIcon className="size-3" />
            {sizeLabel}
          </span>
        ) : null}
      </div>
      {roomType.amenities.length > 0 ? (
        <button
          type="button"
          onClick={onToggleAmenities}
          className="mt-1.5 text-[11px] font-medium text-brand underline-offset-2 hover:underline sm:mt-2 sm:text-xs"
        >
          View Room Amenities
        </button>
      ) : null}
      {amenitiesExpanded ? (
        <ul className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground sm:mt-2 sm:text-xs">
          {roomType.amenities.map((amenity) => (
            <li key={amenity}>• {amenity}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function PropertyRoomList({
  roomTypes,
  currency,
  selectedPlan,
  onSelectPlan,
  emptyMessage = "No rooms available for the selected dates. Try changing your search.",
  showRoomImages = false,
}: PropertyRoomListProps) {
  const [expandedAmenities, setExpandedAmenities] = useState<string | null>(
    null,
  );
  const sortedRoomTypes = useMemo(
    () => sortRoomTypesByPriceAsc(roomTypes),
    [roomTypes],
  );

  if (sortedRoomTypes.length === 0) {
    return (
      <div className="rounded-md border bg-white p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      <MembershipBenefitBanner />
      {sortedRoomTypes.map((roomType) => (
        <RoomTypeCard
          key={roomType.id}
          roomType={roomType}
          currency={currency}
          showRoomImage={showRoomImages}
          amenitiesExpanded={expandedAmenities === roomType.id}
          onToggleAmenities={() =>
            setExpandedAmenities((current) =>
              current === roomType.id ? null : roomType.id,
            )
          }
          selectedRatePlanId={selectedPlan?.ratePlanId ?? null}
          onSelectPlan={(ratePlanId) => {
            const plan = planToSelection(roomType, ratePlanId);
            if (plan) onSelectPlan(plan);
          }}
        />
      ))}
    </div>
  );
}
