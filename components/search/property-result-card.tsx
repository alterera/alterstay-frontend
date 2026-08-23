"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, HeartIcon, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavouriteProperty } from "@/hooks/use-favourite-property";
import { useIsDesktop } from "@/hooks/use-is-desktop";
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
  const areaLabel = property.area ?? property.city ?? "";

  const linkProps = openInNewTab
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl bg-white",
        className,
      )}
    >
      {property.guestRating ? (
        <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">
          <span>★</span>
          <span>{property.guestRating.toFixed(1)}</span>
        </div>
      ) : null}

      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5 lg:p-4">
        <div className="relative">
          <Link
            href={propertyUrl}
            {...linkProps}
            className="relative block aspect-[4/3] overflow-hidden bg-neutral-200 lg:rounded-xl"
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
            className="absolute top-3 left-3 z-20 flex size-9 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm backdrop-blur-sm"
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
              <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1">
                {images.slice(0, 6).map((url, index) => (
                  <span
                    key={`${url}-${index}`}
                    className={cn(
                      "size-1.5 rounded-full",
                      index === activeIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col px-4 py-3.5 lg:px-0 lg:py-1">
          <Link href={propertyUrl} {...linkProps} className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-neutral-900 lg:text-lg">
              {property.name}
            </h3>
            {areaLabel ? (
              <p className="mt-0.5 truncate text-sm text-neutral-500">
                {areaLabel}
              </p>
            ) : null}
          </Link>

          {isDesktop && property.amenities.length ? (
            <div className="mt-3 hidden flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-sky-700 lg:flex">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span key={amenity}>{amenity}</span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex items-end justify-between gap-3 lg:mt-auto">
            <div>
              {displayPrice !== null ? (
                <>
                  <p className="text-lg font-bold tracking-tight text-neutral-900 lg:text-2xl">
                    ₹{displayPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-neutral-500">
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

            <div className="hidden gap-2 lg:flex">
              {property.hasSingleRoomType ? (
                <Button
                  render={<Link href={propertyUrl} {...linkProps} />}
                  className="rounded-full bg-brand px-6 text-brand-foreground hover:bg-brand/90"
                >
                  Book Now
                </Button>
              ) : (
                <>
                  <Button
                    render={<Link href={propertyUrl} {...linkProps} />}
                    variant="outline"
                    className="rounded-full border-brand px-5 text-brand hover:bg-brand/5"
                  >
                    Select Room
                  </Button>
                  <Button
                    render={<Link href={propertyUrl} {...linkProps} />}
                    className="rounded-full bg-brand px-4 text-brand-foreground hover:bg-brand/90"
                    title="Quick Book"
                  >
                    <Zap className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
