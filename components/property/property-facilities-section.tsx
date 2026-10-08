"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { amenityIcon } from "@/lib/amenity-icons";
import { cn } from "@/lib/utils";
import type { PropertyAmenityDetail } from "@/types/property-detail";

type PropertyFacilitiesSectionProps = {
  amenities: PropertyAmenityDetail[];
};

const VISIBLE_AMENITIES = 6;

function AmenityTile({
  amenity,
  compact = false,
}: {
  amenity: PropertyAmenityDetail;
  compact?: boolean;
}) {
  const Icon = amenityIcon(amenity.name, amenity.icon);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border bg-white text-center",
        compact ? "px-2 py-3" : "px-3 py-4",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
        <Icon className="size-4" />
      </span>
      <span className="text-xs font-medium leading-snug">{amenity.name}</span>
    </div>
  );
}

function AmenityRow({ amenity }: { amenity: PropertyAmenityDetail }) {
  const Icon = amenityIcon(amenity.name, amenity.icon);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex size-9 shrink-0 items-center justify-center text-brand">
        <Icon className="size-4" />
      </span>
      <span className="font-medium">{amenity.name}</span>
    </div>
  );
}

export function PropertyFacilitiesSection({
  amenities,
}: PropertyFacilitiesSectionProps) {
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);

  const mergedAmenities = useMemo(() => {
    const seen = new Set<string>();
    return amenities.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [amenities]);

  const visibleAmenities = mergedAmenities.slice(0, VISIBLE_AMENITIES);

  if (mergedAmenities.length === 0) {
    return null;
  }

  return (
    <section id="facilities" className="scroll-mt-36 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Facilities
        </p>
        <h2 className="mt-1 text-xl font-semibold">What this place offers</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:hidden">
        {visibleAmenities.map((amenity) => (
          <AmenityTile key={amenity.id} amenity={amenity} compact />
        ))}
      </div>

      <div className="hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {visibleAmenities.map((amenity) => (
          <AmenityRow key={amenity.id} amenity={amenity} />
        ))}
      </div>

      {mergedAmenities.length > VISIBLE_AMENITIES ? (
        <Button
          type="button"
          variant="outline"
          className="rounded-md"
          onClick={() => setAmenitiesOpen(true)}
        >
          Show all amenities
        </Button>
      ) : null}

      <Dialog open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
        <DialogContent className="max-h-[80vh] w-[calc(100%-3rem)] max-w-sm overflow-hidden rounded-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Property Amenities</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {mergedAmenities.map((amenity) => (
              <AmenityRow key={amenity.id} amenity={amenity} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
