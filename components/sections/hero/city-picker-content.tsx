"use client";

import { CheckIcon, MapPinIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { popularIndianCities } from "@/config/popular-cities";
import { cn } from "@/lib/utils";

export function filterCities(query: string): readonly string[] {
  const term = query.trim().toLowerCase();
  if (!term) return popularIndianCities;
  return popularIndianCities.filter((city) =>
    city.toLowerCase().includes(term),
  );
}

type CitySearchInputProps = {
  query: string;
  onQueryChange: (query: string) => void;
  size?: "sm" | "lg";
};

export function CitySearchInput({
  query,
  onQueryChange,
  size = "sm",
}: CitySearchInputProps) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search city or destination"
        className={cn(
          "rounded-xl pl-9 text-base md:text-base",
          size === "lg" ? "h-12" : "h-10",
        )}
        autoComplete="off"
        enterKeyHint="search"
      />
    </div>
  );
}

type CityListProps = {
  query: string;
  /** Highlighted city — the committed value, or the draft while a sheet is open. */
  selected: string;
  onSelect: (city: string) => void;
  variant?: "popover" | "sheet";
};

export function CityList({
  query,
  selected,
  onSelect,
  variant = "sheet",
}: CityListProps) {
  const cities = filterCities(query);
  const popover = variant === "popover";

  if (cities.length === 0) {
    return (
      <ul>
        <li>
          <button
            type="button"
            onClick={() => onSelect(query.trim())}
            className="w-full rounded-xl px-3 py-3 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
            disabled={!query.trim()}
          >
            Use &quot;{query}&quot;
          </button>
        </li>
      </ul>
    );
  }

  return (
    <ul className={cn("space-y-1", popover && "max-h-48 overflow-y-auto")}>
      {cities.map((city) => {
        const isSelected = city === selected;

        return (
          <li key={city}>
            <button
              type="button"
              onClick={() => onSelect(city)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 text-left transition-colors hover:bg-muted",
                popover ? "rounded-lg py-2 text-sm" : "py-3 text-base",
                isSelected && "bg-muted font-medium",
              )}
            >
              {popover ? null : (
                <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1 truncate">{city}</span>
              {isSelected ? (
                <CheckIcon className="size-4 shrink-0 text-brand" />
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

type CityPickerContentProps = {
  selected: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (city: string) => void;
};

/** Input + list in one block, used by the desktop popover. */
export function CityPickerContent({
  selected,
  query,
  onQueryChange,
  onSelect,
}: CityPickerContentProps) {
  return (
    <div className="space-y-4">
      <CitySearchInput query={query} onQueryChange={onQueryChange} />
      <CityList
        variant="popover"
        query={query}
        selected={selected}
        onSelect={onSelect}
      />
    </div>
  );
}
