"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PropertyFacilitiesSectionProps = {
  perks: string[];
  amenities: string[];
};

const VISIBLE_AMENITIES = 6;

export function PropertyFacilitiesSection({
  perks,
  amenities,
}: PropertyFacilitiesSectionProps) {
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const visibleAmenities = amenities.slice(0, VISIBLE_AMENITIES);

  return (
    <section id="facilities" className="scroll-mt-36 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Facilities
        </p>
        <h2 className="mt-1 text-xl font-semibold">What this place offers</h2>
      </div>

      {perks.length > 0 ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Perks
            </p>
            <p className="text-sm text-muted-foreground">
              Special facilities at this hotel
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <SparklesIcon className="size-4" />
                </span>
                {perk}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {amenities.length > 0 ? (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amenities
            </p>
            <p className="text-sm text-muted-foreground">
              Things that make the stay better
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleAmenities.map((amenity) => (
              <div
                key={amenity}
                className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm"
              >
                {amenity}
              </div>
            ))}
          </div>

          {amenities.length > VISIBLE_AMENITIES ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setAmenitiesOpen(true)}
            >
              View all
            </Button>
          ) : null}
        </div>
      ) : null}

      <Dialog open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle>Property Amenities</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="rounded-lg border bg-muted/30 px-4 py-3 text-sm"
              >
                {amenity}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
