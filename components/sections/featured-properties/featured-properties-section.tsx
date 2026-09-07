"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { ROUTES } from "@/constants/routes";
import { fetchFeaturedProperties } from "@/lib/search-api";
import { cn } from "@/lib/utils";
import type { FeaturedProperty } from "@/types/search-results";

type FeaturedPropertiesSectionProps = {
  className?: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";

function PropertyCard({ property }: { property: FeaturedProperty }) {
  const image = property.imageUrl || FALLBACK;

  return (
    <Link
      href={ROUTES.propertyDetail(property.slug)}
      className="group block w-[46vw] max-w-[11.5rem] shrink-0 snap-start sm:w-auto sm:max-w-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
        <Image
          src={image}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 50vw, 25vw"
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
              Starts from{" "}
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
}: FeaturedPropertiesSectionProps) {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedProperties(8)
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
  }, []);

  if (!loading && properties.length === 0) {
    return null;
  }

  return (
    <section className={cn("bg-background py-8 sm:py-10", className)}>
      <Container>
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Book stays across pan India
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Featured properties travellers love right now
            </p>
          </div>
          <Link
            href={ROUTES.search}
            className="hidden text-sm font-semibold text-brand hover:underline sm:inline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <>
            <div className="-mx-4 flex gap-3 overflow-hidden px-4 sm:mx-0 sm:hidden sm:px-0">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 w-[46vw] max-w-[11.5rem] shrink-0 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:hidden sm:px-0 [&::-webkit-scrollbar]:hidden">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
