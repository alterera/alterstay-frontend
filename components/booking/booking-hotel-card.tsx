"use client";

import { format } from "date-fns";
import { StarIcon } from "lucide-react";

import { PropertyBookingLegalFooter } from "@/components/property/property-booking-legal-footer";
import { formatGuestSummary, getStayNights } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertyDetail, SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

type BookingHotelCardProps = {
  property: PropertyDetail;
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan;
  className?: string;
  layout?: "default" | "mobile-checkout";
  cancellationPolicy?: { name: string; description: string } | null;
};

export function BookingHotelCard({
  property,
  search,
  selectedPlan,
  className,
  layout = "default",
  cancellationPolicy = null,
}: BookingHotelCardProps) {
  const nights = getStayNights(search.dateRange);
  const isMobileCheckout = layout === "mobile-checkout";

  if (isMobileCheckout) {
    return (
      <div className={cn("rounded-md border bg-white px-4 py-3", className)}>
        <div className="flex flex-wrap items-center gap-2">
          {property.guestRating ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold">
              <StarIcon className="size-3.5 fill-premium text-premium" />
              {property.guestRating.toFixed(1)}
            </span>
          ) : null}
          <h2 className="text-base font-semibold leading-snug">{property.name}</h2>
        </div>

        <div className="my-3 border-t" />

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-xs">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Check-in
            </p>
            <p className="mt-0.5 font-semibold">
              {search.dateRange.from
                ? format(search.dateRange.from, "dd MMM yy")
                : "—"}
            </p>
          </div>
          <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {nights > 0
              ? `${nights} Night${nights === 1 ? "" : "s"}`
              : "Stay"}
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Check-out
            </p>
            <p className="mt-0.5 font-semibold">
              {search.dateRange.to
                ? format(search.dateRange.to, "dd MMM yy")
                : "—"}
            </p>
          </div>
        </div>

        <div className="my-3 border-t" />

        <p className="text-center text-xs font-medium text-muted-foreground">
          Total: {formatGuestSummary(search.guests)}
        </p>

        <div className="my-3 border-t" />

        <div className="flex items-start justify-between gap-3 text-sm">
          <div className="min-w-0">
            <p className="font-semibold">
              {search.guests.rooms}× {selectedPlan.roomTypeName}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {selectedPlan.ratePlanName}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {search.guests.adults}{" "}
              {search.guests.adults === 1 ? "Adult" : "Adults"}
            </p>
          </div>
          <PropertyBookingLegalFooter
            cancellationPolicy={cancellationPolicy}
            compact
            policyLinkLabel="View Policy & Details"
            showAgreementText={false}
            className="shrink-0 text-left [&_button]:text-xs"
          />
        </div>
      </div>
    );
  }

  const locationLabel = property.area ?? property.city ?? "";
  const premiumTag = property.tags.find(
    (tag) =>
      tag.code.toUpperCase() === "PREMIUM" ||
      tag.name.toUpperCase() === "PREMIUM",
  );
  const imageUrl =
    property.imageUrls[0] ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800";

  return (
    <div className={cn("rounded-md border bg-white p-4 sm:p-5", className)}>
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

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-md border bg-muted/20 px-3 py-4 text-center sm:px-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Check-In
          </p>
          <p className="mt-1 text-xs font-semibold sm:text-sm">
            {search.dateRange.from
              ? format(search.dateRange.from, "dd MMM yy")
              : "—"}
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
            {search.dateRange.to
              ? format(search.dateRange.to, "dd MMM yy")
              : "—"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
        {formatGuestSummary(search.guests)}
      </p>

      <div className="mt-4 rounded-md border px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-sm">
            <p className="font-semibold">
              {search.guests.rooms} x {selectedPlan.roomTypeName}
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {selectedPlan.ratePlanName}
            </p>
            <p className="mt-0.5 text-muted-foreground">
              {search.guests.adults}{" "}
              {search.guests.adults === 1 ? "Adult" : "Adults"}
            </p>
          </div>
          <PropertyBookingLegalFooter
            cancellationPolicy={cancellationPolicy}
            compact
            className="shrink-0 text-left"
          />
        </div>
      </div>
    </div>
  );
}
