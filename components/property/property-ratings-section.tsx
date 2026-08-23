import { Progress } from "@/components/ui/progress";
import type { PropertyRatingBreakdown } from "@/types/property-detail";

type PropertyRatingsSectionProps = {
  guestRating: number | null;
  breakdown: PropertyRatingBreakdown;
};

const RATING_ITEMS: {
  key: keyof PropertyRatingBreakdown;
  label: string;
}[] = [
  { key: "smoothCheckIn", label: "Smooth Check-in" },
  { key: "roomQuality", label: "Room Quality" },
  { key: "staffBehavior", label: "Staff Behavior" },
  { key: "hotelSurroundings", label: "Hotel Surroundings" },
];

export function PropertyRatingsSection({
  guestRating,
  breakdown,
}: PropertyRatingsSectionProps) {
  return (
    <section id="ratings" className="scroll-mt-36 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ratings
        </p>
        <h2 className="mt-1 text-xl font-semibold">
          What people think of this hotel
        </h2>
        {guestRating ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Overall guest rating{" "}
            <span className="font-semibold text-foreground">
              {guestRating.toFixed(1)} / 5
            </span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {RATING_ITEMS.map((item) => {
          const value = breakdown[item.key];
          return (
            <div
              key={item.key}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{item.label}</p>
                <span className="text-sm font-semibold text-brand">
                  {value.toFixed(1)}
                </span>
              </div>
              <Progress value={value} max={5} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
