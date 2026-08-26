"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  HeartIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavouriteProperty } from "@/hooks/use-favourite-property";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { amenityIcon } from "@/lib/amenity-icons";
import { buildPropertyUrl } from "@/lib/property-url";
import { cn } from "@/lib/utils";
import type { PropertySearchResult } from "@/types/search-results";
import type { PropertySearchParams } from "@/types/search";

type PropertyResultCardProps = {
  property: PropertySearchResult;
  search: PropertySearchParams;
  className?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";

function ratingLabel(score10: number) {
  if (score10 >= 9) return "Excellent";
  if (score10 >= 8) return "Very good";
  if (score10 >= 7) return "Good";
  if (score10 >= 6) return "Pleasant";
  return "Fair";
}

export function PropertyResultCard({
  property,
  search,
  className,
}: PropertyResultCardProps) {
  const isDesktop = useIsDesktop();
  const { isFavourite, toggleFavourite } = useFavouriteProperty(property.slug);
  const propertyUrl = buildPropertyUrl(property.slug, search);
  const openInNewTab = isDesktop === true;

  const images =
    property.imageUrls.length > 0 ? property.imageUrls : [FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  function shiftImage(delta: number) {
    setActiveIndex((current) => {
      const next = current + delta;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  }

  const displayPrice =
    property.minPricePerNight ?? property.minTotalPrice ?? null;
  const locationParts = [
    property.postalCode,
    property.city,
    property.area && property.area !== property.city ? property.area : null,
  ].filter(Boolean);
  const promoTag = property.tags[0];
  const score10 =
    property.guestRating != null
      ? Math.round(property.guestRating * 20) / 10
      : null;

  const linkProps = openInNewTab
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <article
      className={cn("relative overflow-hidden rounded-md bg-white", className)}
    >
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-stretch">
        <div className="relative">
          <Link
            href={propertyUrl}
            {...linkProps}
            className="relative block aspect-[4/3] overflow-hidden bg-neutral-200 lg:aspect-auto lg:h-full lg:min-h-[220px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={property.name}
              className="absolute inset-0 size-full object-cover"
            />
          </Link>

          <button
            type="button"
            aria-label={
              isFavourite ? "Remove from favourites" : "Add to favourites"
            }
            aria-pressed={isFavourite}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleFavourite();
            }}
            className="absolute top-3 left-3 z-20 flex size-9 items-center justify-center rounded-full bg-white text-neutral-800 shadow-sm"
          >
            <HeartIcon
              className={cn(
                "size-4",
                isFavourite ? "fill-rose-500 text-rose-500" : "text-neutral-700",
              )}
            />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  shiftImage(-1);
                }}
                className="absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  shiftImage(1);
                }}
                className="absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col px-4 py-3.5 lg:px-5 lg:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1 text-xs text-neutral-700">
              {property.starRating
                ? Array.from({ length: property.starRating }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className="size-3.5 fill-neutral-900 text-neutral-900"
                    />
                  ))
                : null}
              {property.starRating ? (
                <span className="ml-1 font-medium">Alterstay Stars</span>
              ) : null}
            </div>

            <div className="flex items-start gap-2">
              {promoTag ? (
                <span className="rounded-sm bg-neutral-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-600">
                  {promoTag.name}
                </span>
              ) : null}
              {score10 != null ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-neutral-900 px-2 py-1 text-sm font-bold text-white">
                    {score10.toFixed(1)}
                  </span>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold leading-tight">
                      {ratingLabel(score10)}
                    </p>
                    {(property.reviewCount ?? 0) > 0 ? (
                      <p className="text-[11px] text-neutral-500">
                        Based on {property.reviewCount} reviews
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <Link href={propertyUrl} {...linkProps} className="mt-2 min-w-0">
            <h3 className="truncate text-lg font-bold tracking-tight text-neutral-900">
              {property.name}
            </h3>
            {locationParts.length ? (
              <p className="mt-0.5 truncate text-sm text-neutral-500">
                {locationParts.join(", ")}
              </p>
            ) : null}
          </Link>

          {property.amenities.length ? (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-neutral-600">
              {property.amenities.slice(0, 4).map((amenity) => {
                const Icon = amenityIcon(amenity);
                return (
                  <span key={amenity} className="inline-flex items-center gap-1">
                    <Icon className="size-3.5" strokeWidth={1.75} />
                    {amenity}
                  </span>
                );
              })}
              {property.area ? (
                <>
                  <span className="hidden h-3 w-px bg-neutral-300 sm:block" />
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="size-3.5" />
                    {property.area}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex flex-1 items-end justify-between gap-3">
            <div className="min-w-0">
              {property.remainingRooms != null &&
              property.remainingRooms > 0 &&
              property.remainingRooms <= 3 ? (
                <p className="text-sm font-medium text-brand">
                  Only {property.remainingRooms}{" "}
                  {property.remainingRooms === 1 ? "room" : "rooms"} left on our
                  site
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-end gap-4">
              <div className="text-right">
                {displayPrice !== null ? (
                  <>
                    <p className="text-xs text-neutral-500">Standard rate</p>
                    <p className="text-2xl font-bold leading-none tracking-tight text-neutral-900">
                      ₹{displayPrice.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      / night
                      {property.estimatedTaxes
                        ? ` · +₹${property.estimatedTaxes.toLocaleString("en-IN")} taxes`
                        : ""}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-neutral-500">Price on request</p>
                )}
              </div>
              <Button
                render={<Link href={propertyUrl} {...linkProps} />}
                className="hidden h-10 rounded-full bg-sky-400 px-5 text-sm font-semibold text-neutral-900 hover:bg-sky-400/90 lg:inline-flex"
              >
                Hotel details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
