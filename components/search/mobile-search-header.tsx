"use client";

import { PencilIcon, SlidersHorizontalIcon } from "lucide-react";

import { formatGuestCountShort, formatNavDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/search";

type MobileSearchHeaderProps = {
  search: PropertySearchParams;
  onEdit: () => void;
  onFilter: () => void;
  filterActive?: boolean;
  className?: string;
};

export function MobileSearchHeader({
  search,
  onEdit,
  onFilter,
  filterActive = false,
  className,
}: MobileSearchHeaderProps) {
  const summary = `${formatNavDateRange(search.dateRange)} · ${formatGuestCountShort(search.guests)}`;

  return (
    <div
      className={cn(
        "border-b border-black/5 bg-white/90 px-4 py-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="truncate text-[17px] font-semibold tracking-tight text-neutral-900">
              {search.city}
            </h1>
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit search"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <PencilIcon className="size-3.5" />
            </button>
          </div>
          <p className="mt-0.5 truncate text-[13px] text-neutral-500">{summary}</p>
        </div>

        <button
          type="button"
          onClick={onFilter}
          aria-label="Open filters"
          aria-pressed={filterActive}
          className={cn(
            "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors",
            filterActive
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white text-neutral-800 shadow-sm",
          )}
        >
          <SlidersHorizontalIcon className="size-4" />
          {filterActive ? (
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand" />
          ) : null}
        </button>
      </div>
    </div>
  );
}
