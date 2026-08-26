"use client";

import { PencilIcon, SlidersHorizontalIcon } from "lucide-react";

import { formatCompactDateRange } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/search";

type MobileSearchHeaderProps = {
  search: PropertySearchParams;
  onEdit: () => void;
  onFilter: () => void;
  filterActive?: boolean;
  className?: string;
};

function iconButtonClass(active = false) {
  return cn(
    "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border bg-white text-neutral-800 shadow-sm transition-colors",
    active ? "border-neutral-900" : "border-neutral-200",
  );
}

export function MobileSearchHeader({
  search,
  onEdit,
  onFilter,
  filterActive = false,
  className,
}: MobileSearchHeaderProps) {
  const people = search.guests.adults + search.guests.children;
  const summary = `${formatCompactDateRange(search.dateRange)} | ${people} ${
    people === 1 ? "person" : "people"
  } ${search.guests.rooms} ${search.guests.rooms === 1 ? "room" : "rooms"}`;

  return (
    <div
      className={cn(
        "border-b border-black/5 bg-white/90 px-4 py-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit search"
          className={iconButtonClass()}
        >
          <PencilIcon className="size-4" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-bold tracking-tight text-neutral-900">
            {search.city}
          </h1>
          <p className="mt-0.5 truncate text-[13px] text-neutral-500">{summary}</p>
        </div>

        <button
          type="button"
          onClick={onFilter}
          aria-label="Open filters"
          aria-pressed={filterActive}
          className={iconButtonClass(filterActive)}
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
