"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { fetchFeaturedProperties } from "@/lib/search-api";
import { cn } from "@/lib/utils";
import type { FeaturedProperty } from "@/types/search-results";

type FeaturedPropertiesSectionProps = {
  className?: string;
  city?: string;
  excludeSlug?: string;
  limit?: number;
  title?: string;
  subtitle?: string;
  /** Full-bleed horizontal carousel (homepage). */
  bleed?: boolean;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";

const CARD_CLASS_CONTAINED =
  "w-[calc((100%-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100%-2.25rem)/3)] lg:w-[calc((100%-3rem)/4)]";

const CARD_CLASS_BLEED =
  "w-[calc((100vw-2rem-0.75rem)/2)] shrink-0 snap-start sm:w-[calc((100vw-3rem-2.25rem)/3)] lg:w-[calc((100vw-4rem-3rem)/4)]";

function PropertyCard({
  property,
  cardClass,
}: {
  property: FeaturedProperty;
  cardClass: string;
}) {
  const image = property.imageUrl || FALLBACK;

  return (
    <Link
      href={ROUTES.propertyDetail(property.slug)}
      className={cn("group block", cardClass)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
        <Image
          src={image}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="space-y-1 pt-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
            {property.name}
          </h3>
          {property.guestRating != null ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-neutral-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              <StarIcon className="size-3 fill-white" />
              {property.guestRating.toFixed(1)}
            </span>
          ) : null}
        </div>
        {(property.area || property.city) && (
          <p className="truncate text-xs text-muted-foreground">
            {[property.area, property.city].filter(Boolean).join(", ")}
          </p>
        )}
        <p className="pt-0.5 text-sm font-semibold text-foreground">
          {property.startsFrom != null ? (
            <>
              Starts{" "}
              <span className="text-brand">
                ₹{property.startsFrom.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / night
              </span>
            </>
          ) : (
            <span className="text-xs font-normal text-muted-foreground">
              Price on request
            </span>
          )}
        </p>
        {(property.reviewCount ?? 0) > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            Based on {property.reviewCount} reviews
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function FeaturedPropertiesSection({
  className,
  city,
  excludeSlug,
  limit = 8,
  title = "Book stays across India",
  subtitle = "Featured properties travellers love right now",
  bleed = false,
}: FeaturedPropertiesSectionProps) {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardClass = bleed ? CARD_CLASS_BLEED : CARD_CLASS_CONTAINED;

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedProperties({ limit, city, excludeSlug })
      .then((items) => {
        if (!cancelled) setProperties(items);
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city, excludeSlug, limit]);

  const scrollByDirection = useCallback((direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("a");
    const gap = 12;
    const amount = firstCard
      ? firstCard.offsetWidth + gap
      : container.clientWidth * 0.8;

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  if (!loading && properties.length === 0) {
    return null;
  }

  const showArrows = !loading && properties.length > 1;

  const carousel = loading ? (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={cn("space-y-2", cardClass)}>
          <Skeleton className="aspect-[4/3] rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  ) : (
    <div
      ref={scrollRef}
      className={cn(
        "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        bleed &&
          "scroll-pl-4 scroll-pr-4 pl-4 pr-4 sm:scroll-pl-6 sm:scroll-pr-6 sm:pl-6 sm:pr-6 lg:scroll-pl-8 lg:scroll-pr-8 lg:pl-8 lg:pr-8",
      )}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          cardClass={cardClass}
        />
      ))}
    </div>
  );

  return (
    <section className={cn("bg-background py-8 sm:py-10", className)}>
      <Container>
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {showArrows ? (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-8 rounded-full"
                onClick={() => scrollByDirection("prev")}
                aria-label="Previous properties"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-8 rounded-full"
                onClick={() => scrollByDirection("next")}
                aria-label="Next properties"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </Container>

      {bleed ? (
        <div className="-mx-0 overflow-hidden">{carousel}</div>
      ) : (
        <Container>{carousel}</Container>
      )}
    </section>
  );
}
