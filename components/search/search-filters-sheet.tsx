"use client";

import { XIcon } from "lucide-react";

import { SearchFiltersPanel } from "@/components/search/search-filters-panel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { type SearchArea, type SearchFilters, type SearchPropertyType } from "@/types/search-results";

type SearchFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: string;
  areas: SearchArea[];
  propertyTypes: SearchPropertyType[];
  filters: SearchFilters;
  areaSearch: string;
  onAreaSearchChange: (value: string) => void;
  onChange: (filters: SearchFilters) => void;
  onClear: () => void;
  onApply: () => void;
  resultCount: number;
};

function activeFilterCount(filters: SearchFilters) {
  return (
    filters.areaIds.length +
    filters.priceBuckets.length +
    filters.propertyTypeIds.length +
    (filters.minRating != null ? 1 : 0) +
    (filters.businessHotels ? 1 : 0)
  );
}

export function SearchFiltersSheet({
  open,
  onOpenChange,
  city,
  areas,
  propertyTypes,
  filters,
  areaSearch,
  onAreaSearchChange,
  onChange,
  onClear,
  onApply,
  resultCount,
}: SearchFiltersSheetProps) {
  const selected = activeFilterCount(filters);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="inset-x-0 bottom-0 h-[78dvh] max-h-[78dvh] w-full gap-0 overflow-hidden rounded-t-xl border-0 bg-background p-0 shadow-none data-[side=bottom]:h-[78dvh] data-[side=bottom]:max-h-[78dvh]"
      >
        <div className="flex h-full min-h-0 flex-col pt-[env(safe-area-inset-top)]">
          <header className="shrink-0 border-b bg-background px-5 pb-3 pt-3">
            <div className="mb-3 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-muted-foreground/25" />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label="Close filters"
              >
                <XIcon className="size-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-lg font-semibold tracking-tight">
                  Filters
                  {selected > 0 ? (
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      ({selected} selected)
                    </span>
                  ) : null}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Refine search results by area, price, rating, and property type
                </SheetDescription>
              </div>
              <button
                type="button"
                className="shrink-0 text-sm font-medium text-brand disabled:text-muted-foreground"
                onClick={onClear}
                disabled={selected === 0}
              >
                Reset
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <SearchFiltersPanel
              city={city}
              areas={areas}
              propertyTypes={propertyTypes}
              filters={filters}
              areaSearch={areaSearch}
              onAreaSearchChange={onAreaSearchChange}
              onChange={onChange}
              variant="sheet"
              compact
            />
          </div>

          <footer className="shrink-0 border-t bg-background px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button
              type="button"
              className="h-12 w-full rounded-full bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
              onClick={onApply}
            >
              {resultCount === 1
                ? "Show 1 stay"
                : `Show ${resultCount.toLocaleString("en-IN")} stays`}
            </Button>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
}
