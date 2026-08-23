"use client";

import { useState } from "react";
import {
  BedDoubleIcon,
  ImagesIcon,
  RulerIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { planToSelection } from "@/lib/property-booking";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  PropertyDetail,
  PropertyRoomTypeDetail,
  SelectedRoomPlan,
} from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

import { PropertySearchUpdateBar } from "./property-search-update-bar";

type PropertyRoomOptionsSectionProps = {
  property: PropertyDetail;
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  onSearchUpdate: (search: PropertySearchParams) => void;
  onSelectPlan: (plan: SelectedRoomPlan) => void;
};

const FALLBACK_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800";

function mockOriginalPrice(pricePerNight: number): number {
  return Math.round(pricePerNight * 1.18);
}

export function PropertyRoomOptionsSection({
  property,
  search,
  selectedPlan,
  onSearchUpdate,
  onSelectPlan,
}: PropertyRoomOptionsSectionProps) {
  const [expandedAmenities, setExpandedAmenities] = useState<string | null>(
    null,
  );

  return (
    <section id="room-options" className="scroll-mt-36 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rate Plans
        </p>
        <h2 className="mt-1 text-xl font-semibold">Select your stay option</h2>
      </div>

      <div className="rounded-2xl border bg-muted/30 p-4">
        <h3 className="mb-4 text-lg font-semibold">Room Options</h3>
        <PropertySearchUpdateBar search={search} onUpdate={onSearchUpdate} />

        <div className="mt-4 space-y-4">
          {property.roomTypes.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-sm text-muted-foreground">
              No rooms available for the selected dates. Try changing your
              search.
            </div>
          ) : (
            property.roomTypes.map((roomType) => (
              <RoomTypeCard
                key={roomType.id}
                roomType={roomType}
                currency={property.currency}
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
            ))
          )}
        </div>
      </div>
    </section>
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
  const imageUrl = roomType.imageUrls[0] ?? FALLBACK_ROOM_IMAGE;
  const extraImages = Math.max(0, roomType.imageUrls.length - 1);
  const sizeLabel = roomType.sizeSqm
    ? `${Math.round(roomType.sizeSqm * 10.7639)}sq ft`
    : null;

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-3">
        <h4 className="text-lg font-semibold">{roomType.name}</h4>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={roomType.name}
              className="aspect-[4/3] w-full object-cover"
            />
            {extraImages > 0 ? (
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-medium shadow">
                <ImagesIcon className="size-3.5" />
                {extraImages} more
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
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
              className="text-xs font-medium text-sky-700 underline-offset-2 hover:underline"
            >
              View Room Amenities
            </button>
          ) : null}

          {amenitiesExpanded ? (
            <ul className="space-y-1 text-xs text-muted-foreground">
              {roomType.amenities.map((amenity) => (
                <li key={amenity}>• {amenity}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-3">
          {roomType.ratePlans.map((plan, index) => {
            const isSelected = selectedRatePlanId === plan.id;
            const pricePerNight = plan.pricePerNight ?? 0;
            const originalPrice = mockOriginalPrice(pricePerNight);

            return (
              <div key={plan.id}>
                {index > 0 ? <Separator className="my-3" /> : null}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div>
                      <p className="font-semibold">{plan.name}</p>
                      <button
                        type="button"
                        className="text-xs font-medium text-sky-700 underline-offset-2 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2 py-1 text-[11px] font-medium text-orange-700">
                      <TagIcon className="size-3" />1 offer applied
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="text-right">
                      {plan.pricePerNight !== null ? (
                        <>
                          <p className="text-xl font-bold">
                            {formatCurrency(plan.pricePerNight, currency)}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCurrency(originalPrice, currency)}/night
                          </p>
                          {plan.estimatedTaxes ? (
                            <p className="text-xs text-muted-foreground">
                              +{formatCurrency(plan.estimatedTaxes, currency)}{" "}
                              Taxes
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
                        "min-w-24 rounded-lg",
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
      </div>
    </article>
  );
}
