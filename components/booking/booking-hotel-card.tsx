"use client";

import { StarIcon } from "lucide-react";

import {
  formatBookingDateTime,
  formatGuestSummary,
  getStayNights,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertyDetail, SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

type BookingHotelCardProps = {
  property: PropertyDetail;
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan;
  className?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800";

export function BookingHotelCard({
  property,
  search,
  selectedPlan,
  className,
}: BookingHotelCardProps) {
  const nights = getStayNights(search.dateRange);
  const imageUrl = property.imageUrls[0] ?? FALLBACK_IMAGE;
  const locationLabel = property.area ?? property.city ?? "";
  const premiumTag = property.tags.find(
    (tag) => tag.code.toUpperCase() === "PREMIUM" || tag.name.toUpperCase() === "PREMIUM",
  );

  return (
    <div className={cn("rounded-2xl border bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="flex gap-4">
        <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {property.guestRating ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-foreground">
                <StarIcon className="size-3 fill-premium text-premium" />
                {property.guestRating.toFixed(1)}
              </span>
            ) : null}
            {premiumTag ? (
              <span className="rounded-md bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
                {premiumTag.name}
              </span>
            ) : null}
          </div>

          <h2 className="mt-2 text-base font-semibold leading-snug sm:text-lg">
            {property.name}
          </h2>
          {locationLabel ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{locationLabel}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border bg-muted/20 px-3 py-4 text-center sm:px-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Check-In
          </p>
          <p className="mt-1 text-xs font-semibold sm:text-sm">
            {formatBookingDateTime(search.dateRange.from, property.checkInTime)}
          </p>
        </div>

        <div className="px-2">
          <span className="inline-block rounded-full border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            {nights > 0
              ? `${nights} Night${nights === 1 ? "" : "s"}`
              : "Stay"}
          </span>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Check-Out
          </p>
          <p className="mt-1 text-xs font-semibold sm:text-sm">
            {formatBookingDateTime(search.dateRange.to, property.checkOutTime)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
        {formatGuestSummary(search.guests)}
      </p>

      <div className="mt-4 rounded-xl border px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-sm">
            <p className="font-semibold">
              {search.guests.rooms} x {selectedPlan.roomTypeName}
            </p>
            <p className="mt-0.5 text-muted-foreground">{selectedPlan.ratePlanName}</p>
            <p className="mt-0.5 text-muted-foreground">
              {search.guests.adults}{" "}
              {search.guests.adults === 1 ? "Adult" : "Adults"}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 text-xs font-medium text-sky-700 hover:underline sm:text-sm"
          >
            View Policy &amp; Details
          </button>
        </div>
      </div>
    </div>
  );
}
