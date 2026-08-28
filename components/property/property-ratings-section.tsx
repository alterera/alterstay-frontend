import { format, parseISO } from "date-fns";
import { StarIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  buildGuestReviews,
  getMockReviewCount,
  getRatingLabel,
} from "@/lib/property-enrichment";
import { cn } from "@/lib/utils";
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

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex shrink-0 items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "size-3.5",
            index < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  );
}

export function PropertyRatingsSection({
  guestRating,
  breakdown,
}: PropertyRatingsSectionProps) {
  const rating = guestRating ?? 4.2;
  const reviewCount = getMockReviewCount(guestRating);
  const reviews = buildGuestReviews(guestRating);
  const displayedReviews = reviews.slice(0, 3);

  return (
    <section id="ratings" className="scroll-mt-36 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ratings
        </p>
        <h2 className="mt-1 text-xl font-semibold">
          What people think of this hotel
        </h2>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">
              {rating.toFixed(1)}
            </span>
            <StarIcon className="size-7 fill-amber-400 text-amber-400" />
          </div>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {getRatingLabel(rating)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            <span>{reviewCount.toLocaleString()} Ratings</span>
          </p>
        </div>

        <div className="space-y-2">
          {RATING_ITEMS.map((item) => {
            const value = breakdown[item.key];
            return (
              <div
                key={item.key}
                className="grid grid-cols-[minmax(0,7.5rem)_1fr_1.75rem] items-center gap-x-2.5"
              >
                <p className="truncate text-xs text-muted-foreground">
                  {item.label}
                </p>
                <Progress value={value} max={5} className="h-1" />
                <span className="text-right text-xs font-medium tabular-nums text-foreground">
                  {value.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-5 border-t pt-6">
        {displayedReviews.map((review) => (
          <article
            key={review.id}
            className="border-b border-border/60 pb-5 last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback className="bg-muted text-xs font-medium text-foreground">
                    {review.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <p className="truncate text-sm font-semibold text-foreground">
                  {review.authorName}
                </p>
                <time
                  dateTime={review.date}
                  className="hidden shrink-0 text-xs text-muted-foreground sm:inline"
                >
                  {format(parseISO(review.date), "d MMM yyyy")}
                </time>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <time
                  dateTime={review.date}
                  className="text-xs text-muted-foreground sm:hidden"
                >
                  {format(parseISO(review.date), "d MMM yyyy")}
                </time>
                <ReviewStars rating={review.rating} />
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          </article>
        ))}

        {reviews.length > 3 ? (
          <button
            type="button"
            className="text-sm font-semibold text-brand transition-colors hover:text-brand/80"
          >
            See all reviews
          </button>
        ) : null}
      </div>
    </section>
  );
}
