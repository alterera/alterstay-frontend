"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildSearchUrl } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/search";
import { createDefaultSearchParams } from "@/types/search";

import { CityPicker } from "./city-picker";
import { DateRangePicker } from "./date-range-picker";
import { GuestsPicker } from "./guests-picker";
import type { PickerSheetVariant } from "./picker-sheet";

type HeroSearchFormProps = {
  defaultValues?: PropertySearchParams;
  onSearch?: (params: PropertySearchParams) => void;
  className?: string;
  /** When provided, form state syncs when defaultValues change (search page). */
  syncWithDefaults?: boolean;
  /**
   * Enables the single-row layout that can animate between its full size and
   * the compact navbar size. Markup stays identical in both states.
   */
  morph?: boolean;
  /** Collapsed presentation: labels and icons hidden, search shown as an icon. */
  compact?: boolean;
  dateLayout?: "split" | "combined";
  /**
   * How the mobile pickers present themselves. The search results page uses
   * `fullscreen` so each field reads as its own page instead of a bottom sheet.
   */
  mobilePickerVariant?: PickerSheetVariant;
};

const MORPH_TRANSITION = "transition-all duration-500 ease-in-out";

export function HeroSearchForm({
  defaultValues,
  onSearch,
  className,
  syncWithDefaults = false,
  morph = false,
  compact = false,
  dateLayout = "split",
  mobilePickerVariant = "sheet",
}: HeroSearchFormProps) {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<PropertySearchParams>(
    () => defaultValues ?? createDefaultSearchParams(),
  );

  useEffect(() => {
    if (syncWithDefaults && defaultValues) {
      setSearchParams(defaultValues);
    }
  }, [defaultValues, syncWithDefaults]);

  function handleSearch() {
    if (onSearch) {
      onSearch(searchParams);
      return;
    }

    router.push(buildSearchUrl(searchParams));
  }

  return (
    <div
      className={cn(
        "w-full bg-white ring-1 ring-black/5",
        morph && MORPH_TRANSITION,
        // Morph heights are fixed on purpose: the collapsed pill (h-10) sits
        // centred in the 56px navbar row, and a definite height lets the bar
        // animate its size instead of snapping between auto heights.
        compact
          ? "h-10 rounded-full p-1 shadow-md"
          : morph
            ? "h-20 rounded-full p-2 shadow-xl shadow-black/10"
            : "rounded-[2rem] p-3 shadow-2xl shadow-black/10 sm:rounded-full sm:p-2",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          morph
            ? "h-full flex-row items-center"
            : "flex-col lg:flex-row lg:items-center",
          compact ? "gap-0" : "gap-2",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1",
            morph
              ? "flex-row items-center"
              : "flex-col lg:flex-row lg:items-center",
          )}
        >
          <CityPicker
            value={searchParams.city}
            onChange={(city) =>
              setSearchParams((current) => ({ ...current, city }))
            }
            compact={compact}
            sheetVariant={mobilePickerVariant}
            className={morph ? "min-w-0 flex-1" : "lg:flex-1"}
          />

          {morph ? null : <Separator className="lg:hidden" />}
          <Separator
            orientation="vertical"
            className={cn(
              "mx-1 data-vertical:self-center",
              MORPH_TRANSITION,
              morph ? "block" : "hidden lg:block",
              compact ? "data-vertical:h-6" : "data-vertical:h-10",
            )}
          />

          <DateRangePicker
            value={searchParams.dateRange}
            onChange={(dateRange) =>
              setSearchParams((current) => ({ ...current, dateRange }))
            }
            compact={compact}
            layout={dateLayout}
            sheetVariant={mobilePickerVariant}
            className={morph ? "min-w-0 flex-[1.4]" : "lg:flex-[1.6]"}
          />

          {morph ? null : <Separator className="lg:hidden" />}
          <Separator
            orientation="vertical"
            className={cn(
              "mx-1 data-vertical:self-center",
              MORPH_TRANSITION,
              morph ? "block" : "hidden lg:block",
              compact ? "data-vertical:h-6" : "data-vertical:h-10",
            )}
          />

          <GuestsPicker
            value={searchParams.guests}
            onChange={(guests) =>
              setSearchParams((current) => ({ ...current, guests }))
            }
            compact={compact}
            sheetVariant={mobilePickerVariant}
            className={morph ? "min-w-0 flex-1" : "lg:flex-1"}
          />
        </div>

        <Button
          type="button"
          size="lg"
          onClick={handleSearch}
          aria-label="Search"
          className={cn(
            "shrink-0 bg-brand text-brand-foreground hover:bg-brand/90",
            morph && MORPH_TRANSITION,
            compact
              ? "size-8 gap-0 rounded-full px-0"
              : morph
                ? "ml-2 h-14 w-auto gap-2 rounded-full px-6"
                : "h-12 w-full gap-2 rounded-full px-6 text-sm font-semibold sm:h-14 lg:ml-2 lg:w-auto lg:min-w-35",
          )}
        >
          <SearchIcon className="size-4" />
          <span
            className={cn(
              "overflow-hidden text-sm font-semibold whitespace-nowrap",
              morph && MORPH_TRANSITION,
              compact ? "max-w-0 opacity-0" : "max-w-24 opacity-100",
            )}
          >
            Search
          </span>
        </Button>
      </div>
    </div>
  );
}
