"use client";

import type { PropertyDetail, SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

import { PropertyRoomList } from "./property-room-list";
import { PropertySearchUpdateBar } from "./property-search-update-bar";

type PropertyRoomOptionsSectionProps = {
  property: PropertyDetail;
  search: PropertySearchParams;
  selectedPlan: SelectedRoomPlan | null;
  onSearchUpdate: (search: PropertySearchParams) => void;
  onSelectPlan: (plan: SelectedRoomPlan) => void;
};

export function PropertyRoomOptionsSection({
  property,
  search,
  selectedPlan,
  onSearchUpdate,
  onSelectPlan,
}: PropertyRoomOptionsSectionProps) {
  return (
    <section id="room-options" className="hidden scroll-mt-36 space-y-6 lg:block">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rate Plans
        </p>
        <h2 className="mt-1 text-xl font-semibold">Select your stay option</h2>
      </div>

      <div className="rounded-md border bg-muted/30 p-4">
        <h3 className="mb-4 text-lg font-semibold">Room Options</h3>
        <PropertySearchUpdateBar search={search} onUpdate={onSearchUpdate} />

        <div className="mt-4">
          <PropertyRoomList
            roomTypes={property.roomTypes}
            currency={property.currency}
            selectedPlan={selectedPlan}
            onSelectPlan={onSelectPlan}
          />
        </div>
      </div>
    </section>
  );
}
