"use client";

import { MapPinIcon, StarIcon } from "lucide-react";

import type { PropertyDetail } from "@/types/property-detail";

type PropertyInfoSectionProps = {
  property: PropertyDetail;
};

export function PropertyInfoSection({ property }: PropertyInfoSectionProps) {
  const locationLabel = [property.area, property.city]
    .filter(Boolean)
    .join(", ");

  return (
    <section id="info" className="scroll-mt-36 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {property.starRating ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
            {Array.from({ length: property.starRating }).map((_, index) => (
              <StarIcon
                key={index}
                className="size-3 fill-amber-500 text-amber-500"
              />
            ))}
          </span>
        ) : null}
        {property.guestRating ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-1 text-xs font-semibold text-white">
            ★ {property.guestRating.toFixed(1)}
          </span>
        ) : null}
        {property.isBusinessHotel ? (
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            Business Hotel
          </span>
        ) : null}
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {property.name}
        </h1>
        {locationLabel ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="size-4 shrink-0" />
            {locationLabel}
          </p>
        ) : null}
      </div>

      {property.description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>
      ) : null}

      {property.tags.length ? (
        <div className="flex flex-wrap gap-2">
          {property.tags.map((tag) => (
            <span
              key={tag.code}
              className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
