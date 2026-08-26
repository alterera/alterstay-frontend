"use client";

import { ArrowUpDownIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SortOption } from "@/types/search-results";

type SearchSortBarProps = {
  sortBy: SortOption;
  onChange: (sortBy: SortOption) => void;
  onOpenMobileSort?: () => void;
  className?: string;
};

const PRICE_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "price_asc", label: "Lowest Price First" },
  { id: "price_desc", label: "Highest Price First" },
];

export const MOBILE_SORT_LABELS: Record<SortOption, string> = {
  recommended: "By recommendations",
  price_asc: "By lowest price",
  price_desc: "By highest price",
  rating_asc: "By ratings",
  rating_desc: "By ratings",
};

export function SearchSortBar({
  sortBy,
  onChange,
  onOpenMobileSort,
  className,
}: SearchSortBarProps) {
  const priceActive = sortBy === "price_asc" || sortBy === "price_desc";

  return (
    <>
      <button
        type="button"
        onClick={onOpenMobileSort}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 lg:hidden",
          className,
        )}
      >
        <ArrowUpDownIcon className="size-4" />
        <span className="underline decoration-neutral-900 underline-offset-4">
          {MOBILE_SORT_LABELS[sortBy]}
        </span>
        <ChevronDownIcon className="size-3.5" />
      </button>

      <div
        className={cn(
          "hidden flex-wrap items-center gap-x-3 gap-y-1 text-sm lg:flex",
          className,
        )}
      >
        <span className="text-muted-foreground">Sort by:</span>
        <button
          type="button"
          onClick={() => onChange("recommended")}
          className={cn(
            "font-medium",
            sortBy === "recommended"
              ? "text-foreground underline decoration-foreground/70 underline-offset-4"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Recommended
        </button>

        <div className="group relative">
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              priceActive
                ? "text-foreground underline decoration-foreground/70 underline-offset-4"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Price
            <ChevronDownIcon className="size-3.5" />
          </button>
          <div className="invisible absolute top-full right-0 z-30 min-w-48 pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <div className="rounded-md border bg-white py-1 shadow-md">
              {PRICE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange(option.id)}
                  className={cn(
                    "block w-full px-3 py-2 text-left text-sm hover:bg-muted",
                    sortBy === option.id
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange("rating_desc")}
          className={cn(
            "font-medium",
            sortBy === "rating_desc"
              ? "text-foreground underline decoration-foreground/70 underline-offset-4"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Ratings
        </button>
      </div>
    </>
  );
}
