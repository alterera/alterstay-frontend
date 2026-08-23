"use client";

import { useState } from "react";
import { MapPinIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  CityList,
  CityPickerContent,
  CitySearchInput,
} from "./city-picker-content";
import { PickerSheet, type PickerSheetVariant } from "./picker-sheet";
import { SearchFieldTrigger } from "./search-field-trigger";
import { useIsDesktopPicker } from "./use-is-desktop-picker";

type CityPickerProps = {
  value: string;
  onChange: (city: string) => void;
  className?: string;
  compact?: boolean;
  sheetVariant?: PickerSheetVariant;
};

function DesktopCityPicker({
  value,
  onChange,
  className,
  compact,
}: CityPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setQuery(value);
    }
    setOpen(nextOpen);
  }

  function handleSelect(city: string) {
    onChange(city);
    setQuery(city);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <SearchFieldTrigger
            icon={<MapPinIcon className="size-4" />}
            label="Where to"
            value={value}
            compact={compact}
            className={cn("min-w-0", className)}
          />
        }
      />
      <PopoverContent
        align="start"
        className="w-[min(100vw-2rem,360px)] rounded-2xl p-3"
      >
        <CityPickerContent
          selected={value}
          query={query}
          onQueryChange={setQuery}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

function MobileCityPicker({
  value,
  onChange,
  className,
  compact,
  sheetVariant = "sheet",
}: CityPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(value);
  const fullscreen = sheetVariant === "fullscreen";

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setQuery("");
      setDraft(value);
    }
    setOpen(nextOpen);
  }

  function handleSelect(city: string) {
    if (!city) return;

    // The bottom sheet commits on tap; the full-page variant waits for Apply so
    // the user can review the choice like the other search fields.
    setDraft(city);
    if (!fullscreen) {
      onChange(city);
      setOpen(false);
    }
  }

  function handleApply() {
    onChange(draft);
    setOpen(false);
  }

  return (
    <>
      <SearchFieldTrigger
        icon={<MapPinIcon className="size-4" />}
        label="Where to"
        value={value}
        compact={compact}
        className={cn("min-w-0", className)}
        onClick={() => handleOpenChange(true)}
      />

      <PickerSheet
        open={open}
        onOpenChange={handleOpenChange}
        variant={sheetVariant}
        title="Where to?"
        description="Search and select your destination city"
        stickyContent={
          <CitySearchInput
            query={query}
            onQueryChange={setQuery}
            size={fullscreen ? "lg" : "sm"}
          />
        }
        footer={
          fullscreen ? (
            <Button
              type="button"
              size="lg"
              onClick={handleApply}
              disabled={!draft}
              className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Apply{draft ? ` · ${draft}` : ""}
            </Button>
          ) : null
        }
      >
        {query.trim() ? null : (
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Popular destinations
          </p>
        )}
        <CityList query={query} selected={draft} onSelect={handleSelect} />
      </PickerSheet>
    </>
  );
}

export function CityPicker(props: CityPickerProps) {
  const isDesktop = useIsDesktopPicker();

  if (isDesktop === null) {
    return (
      <SearchFieldTrigger
        icon={<MapPinIcon className="size-4" />}
        label="Where to"
        value={props.value}
        compact={props.compact}
        className={cn("min-w-0", props.className)}
      />
    );
  }

  if (isDesktop) {
    return <DesktopCityPicker {...props} />;
  }

  return <MobileCityPicker {...props} />;
}
