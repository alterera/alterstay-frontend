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
import { planToSelection, sortRoomTypesByPriceAsc } from "@/lib/property-booking";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  PropertyRoomTypeDetail,
  SelectedRoomPlan,
} from "@/types/property-detail";

type PropertyRoomListProps = {
  roomTypes: PropertyRoomTypeDetail[];
  currency: string;
  selectedPlan: SelectedRoomPlan | null;
  onSelectPlan: (plan: SelectedRoomPlan) => void;
  emptyMessage?: string;
};

function MembershipBenefitBanner() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-brand/20 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand text-brand-foreground">
        <CrownIcon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Alterstay membership benefit
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
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
};

function RoomTypeCard({
  roomType,
  currency,
  amenitiesExpanded,
  onToggleAmenities,
  selectedRatePlanId,
  onSelectPlan,
}: RoomTypeCardProps) {
  const sizeLabel = roomType.sizeSqm
    ? `${Math.round(roomType.sizeSqm * 10.7639)}sq ft`
    : null;

  return (
    <article className="overflow-hidden rounded-md border bg-white">
      <div className="border-b px-4 py-3">
        <h4 className="text-lg font-semibold">{roomType.name}</h4>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="size-3.5" />
            Max {roomType.maxOccupancy}
          </span>
          {roomType.bedType ? (
            <span className="inline-flex items-center gap-1">
              <BedDoubleIcon className="size-3.5" />
              {roomType.bedType}
            </span>
          ) : null}
          {sizeLabel ? (
            <span className="inline-flex items-center gap-1">
              <RulerIcon className="size-3.5" />
              {sizeLabel}
            </span>
          ) : null}
        </div>
        {roomType.amenities.length > 0 ? (
          <button
            type="button"
            onClick={onToggleAmenities}
            className="mt-2 text-xs font-medium text-brand underline-offset-2 hover:underline"
          >
            View Room Amenities
          </button>
        ) : null}
        {amenitiesExpanded ? (
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {roomType.amenities.map((amenity) => (
              <li key={amenity}>• {amenity}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        {roomType.ratePlans.map((plan, index) => {
          const isSelected = selectedRatePlanId === plan.id;

          return (
            <div key={plan.id}>
              {index > 0 ? <Separator className="my-3" /> : null}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{plan.name}</p>
                </div>

                <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    {plan.pricePerNight !== null ? (
                      <>
                        <p className="text-xl font-bold">
                          {formatCurrency(plan.pricePerNight, currency)}
                        </p>
                        {plan.estimatedTaxes ? (
                          <p className="text-xs text-muted-foreground">
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

export function PropertyRoomList({
  roomTypes,
  currency,
  selectedPlan,
  onSelectPlan,
  emptyMessage = "No rooms available for the selected dates. Try changing your search.",
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
    <div className="space-y-4">
      <MembershipBenefitBanner />
      {sortedRoomTypes.map((roomType) => (
        <RoomTypeCard
          key={roomType.id}
          roomType={roomType}
          currency={currency}
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
