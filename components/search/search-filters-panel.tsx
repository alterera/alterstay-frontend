"use client";

import { CheckIcon, SearchIcon, StarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PRICE_FILTER_OPTIONS,
  RATING_FILTER_OPTIONS,
  type SearchArea,
  type SearchFilters,
  type SearchPropertyType,
} from "@/types/search-results";

type SearchFiltersPanelProps = {
  city: string;
  areas: SearchArea[];
  propertyTypes: SearchPropertyType[];
  filters: SearchFilters;
  areaSearch: string;
  onAreaSearchChange: (value: string) => void;
  onChange: (filters: SearchFilters) => void;
  className?: string;
  compact?: boolean;
  variant?: "panel" | "sheet";
};

function FilterSection({
  title,
  hint,
  onClear,
  children,
}: {
  title: string;
  hint?: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border-b border-border/80 pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 pt-0.5 text-xs font-medium text-brand"
          >
            Clear
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
        selected
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-background text-foreground hover:border-foreground/30",
      )}
    >
      {children}
    </button>
  );
}

export function SearchFiltersPanel({
  city,
  areas,
  propertyTypes,
  filters,
  areaSearch,
  onAreaSearchChange,
  onChange,
  className,
  compact = false,
  variant = "panel",
}: SearchFiltersPanelProps) {
  const isSheet = variant === "sheet";

  function patch(partial: Partial<SearchFilters>) {
    onChange({ ...filters, ...partial });
  }

  function toggleArrayItem(values: string[], value: string) {
    return values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value];
  }

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(areaSearch.toLowerCase()),
  );

  return (
    <div className={cn(isSheet ? "space-y-6" : "space-y-4", className)}>
      <FilterSection
        title="Areas"
        hint={`Neighbourhoods in ${city}`}
        onClear={filters.areaIds.length ? () => patch({ areaIds: [] }) : undefined}
      >
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={areaSearch}
            onChange={(e) => onAreaSearchChange(e.target.value)}
            placeholder={`Search areas in ${city}`}
            className="h-11 rounded-md pl-10"
          />
        </div>
        <div
          className={cn(
            "space-y-1.5 overflow-y-auto pr-1",
            compact || isSheet ? "max-h-52" : "max-h-56",
          )}
        >
          {filteredAreas.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">
              No areas match that search.
            </p>
          ) : (
            filteredAreas.map((area) => {
              const selected = filters.areaIds.includes(area.id);
              return (
                <label
                  key={area.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                    selected ? "bg-brand/10" : "bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-sm border",
                      selected
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border bg-background",
                    )}
                  >
                    {selected ? <CheckIcon className="size-3.5" /> : null}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected}
                    onChange={() =>
                      patch({
                        areaIds: toggleArrayItem(filters.areaIds, area.id),
                      })
                    }
                  />
                  <span className="font-medium">{area.name}</span>
                </label>
              );
            })
          )}
        </div>
      </FilterSection>

      <FilterSection
        title="Price per night"
        onClear={
          filters.priceBuckets.length
            ? () => patch({ priceBuckets: [] })
            : undefined
        }
      >
        <div className="flex flex-wrap gap-2">
          {PRICE_FILTER_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              selected={filters.priceBuckets.includes(option.id)}
              onClick={() =>
                patch({
                  priceBuckets: toggleArrayItem(
                    filters.priceBuckets,
                    option.id,
                  ),
                })
              }
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Guest rating"
        onClear={
          filters.minRating != null
            ? () => patch({ minRating: null })
            : undefined
        }
      >
        <div className="flex flex-wrap gap-2">
          {RATING_FILTER_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={filters.minRating === option.value}
              onClick={() =>
                patch({
                  minRating:
                    filters.minRating === option.value ? null : option.value,
                })
              }
            >
              <StarIcon className="mr-1 size-3.5 fill-current" />
              {option.label}
            </Chip>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Property type"
        onClear={
          filters.propertyTypeIds.length
            ? () => patch({ propertyTypeIds: [] })
            : undefined
        }
      >
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <Chip
              key={type.id}
              selected={filters.propertyTypeIds.includes(type.id)}
              onClick={() =>
                patch({
                  propertyTypeIds: toggleArrayItem(
                    filters.propertyTypeIds,
                    type.id,
                  ),
                })
              }
            >
              {type.name}
            </Chip>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Stay style">
        <button
          type="button"
          onClick={() => patch({ businessHotels: !filters.businessHotels })}
          className={cn(
            "flex w-full items-center justify-between rounded-md border px-4 py-3.5 text-left",
            filters.businessHotels
              ? "border-brand bg-brand/10"
              : "border-border bg-muted/40",
          )}
        >
          <span>
            <span className="block text-sm font-semibold">Business hotels</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Work-friendly stays with desks and meeting spaces
            </span>
          </span>
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-sm border",
              filters.businessHotels
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-background",
            )}
          >
            {filters.businessHotels ? <CheckIcon className="size-3.5" /> : null}
          </span>
        </button>
      </FilterSection>
    </div>
  );
}
