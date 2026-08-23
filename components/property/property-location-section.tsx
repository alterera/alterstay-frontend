import { MapPinIcon, NavigationIcon } from "lucide-react";

import {
  formatFullAddress,
  getDirectionsUrl,
  getMapEmbedUrl,
} from "@/lib/property-enrichment";
import type { PropertyDetail } from "@/types/property-detail";

type PropertyLocationSectionProps = {
  property: PropertyDetail;
};

export function PropertyLocationSection({
  property,
}: PropertyLocationSectionProps) {
  const address = formatFullAddress(property);
  const mapUrl = getMapEmbedUrl(property);
  const directionsUrl = getDirectionsUrl(property);

  return (
    <section id="location" className="scroll-mt-36 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Location
        </p>
        <h2 className="mt-1 text-xl font-semibold">Where you&apos;ll stay</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-muted">
        {mapUrl ? (
          <iframe
            title={`Map for ${property.name}`}
            src={mapUrl}
            className="aspect-[16/9] w-full border-0 sm:aspect-[21/9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-muted text-sm text-muted-foreground">
            Map unavailable for this property
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <MapPinIcon className="mt-0.5 size-5 shrink-0 text-brand" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            {address}
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
        >
          <NavigationIcon className="size-4" />
          Get Direction
        </a>
      </div>
    </section>
  );
}
