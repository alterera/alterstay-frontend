"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  PencilIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { formatGuestCountShort, formatNavDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/search";
import type { SortOption } from "@/types/search-results";

type MobileSearchHeaderProps = {
  search: PropertySearchParams;
  sortBy: SortOption;
  onEdit: () => void;
  onFilter: () => void;
  onSort: () => void;
  onPrice: () => void;
  filterActive?: boolean;
  className?: string;
};

function chipClass(active = false) {
  return cn(
    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border bg-white px-3.5 text-[13px] font-medium shadow-sm",
    active
      ? "border-brand text-brand ring-1 ring-brand/30"
      : "border-white/70 text-neutral-800",
  );
}

export function MobileSearchHeader({
  search,
  sortBy,
  onEdit,
  onFilter,
  onSort,
  onPrice,
  filterActive = false,
  className,
}: MobileSearchHeaderProps) {
  const router = useRouter();
  const priceActive = sortBy === "price_asc" || sortBy === "price_desc";
  const sortActive = sortBy === "rating_desc";

  return (
    <div className={cn("bg-gradient-hero pb-3 pt-[env(safe-area-inset-top)]", className)}>
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-full bg-white px-2 py-2 shadow-md">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-800"
          >
            <ChevronLeftIcon className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[15px] font-bold tracking-tight text-neutral-900">
              {search.city}
            </h1>
            <p className="mt-0.5 truncate text-[12px] text-neutral-500">
              {formatNavDateRange(search.dateRange)}
              {" · "}
              {formatGuestCountShort(search.guests)}
            </p>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex shrink-0 items-center gap-1.5 pr-3 text-[13px] font-semibold text-brand"
          >
            <PencilIcon className="size-3.5" />
            Edit
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={onFilter}
          aria-pressed={filterActive}
          className={chipClass(filterActive)}
        >
          <SlidersHorizontalIcon className="size-3.5" />
          Filter
        </button>
        <button
          type="button"
          onClick={onSort}
          aria-pressed={sortActive}
          className={chipClass(sortActive)}
        >
          Sort
          <ChevronDownIcon className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onPrice}
          aria-pressed={priceActive}
          className={chipClass(priceActive)}
        >
          Price
          <ChevronDownIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
