"use client";

import { useState } from "react";
import { UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatGuestCountShort, formatGuestSummary } from "@/lib/format";
import type { GuestCounts } from "@/types/search";
import { cn } from "@/lib/utils";

import { GuestsPickerContent } from "./guests-picker-content";
import { PickerSheet, type PickerSheetVariant } from "./picker-sheet";
import { SearchFieldTrigger } from "./search-field-trigger";
import { useIsDesktopPicker } from "./use-is-desktop-picker";

type GuestsPickerProps = {
  value: GuestCounts;
  onChange: (guests: GuestCounts) => void;
  className?: string;
  compact?: boolean;
  sheetVariant?: PickerSheetVariant;
};

function guestLabel(compact: boolean | undefined) {
  return compact ? "Guests" : "Rooms & Guests";
}

function guestValue(value: GuestCounts, compact: boolean | undefined) {
  return compact ? formatGuestCountShort(value) : formatGuestSummary(value);
}

function normalizeGuests(guests: GuestCounts): GuestCounts {
  return { ...guests, children: 0 };
}

function DesktopGuestsPicker({
  value,
  onChange,
  className,
  compact,
}: GuestsPickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <SearchFieldTrigger
            icon={<UsersIcon className="size-4" />}
            label={guestLabel(compact)}
            value={guestValue(value, compact)}
            compact={compact}
            className={cn("min-w-0", className)}
          />
        }
      />
      <PopoverContent
        align="start"
        className="w-[min(100vw-2rem,320px)] rounded-2xl p-4"
      >
        <GuestsPickerContent value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}

function MobileGuestsPicker({
  value,
  onChange,
  className,
  compact,
  sheetVariant = "sheet",
}: GuestsPickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const fullscreen = sheetVariant === "fullscreen";

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraft(value);
    }
    setOpen(nextOpen);
  }

  function handleApply() {
    onChange(draft);
    setOpen(false);
  }

  return (
    <>
      <SearchFieldTrigger
        icon={<UsersIcon className="size-4" />}
        label={guestLabel(compact)}
        value={guestValue(value, compact)}
        compact={compact}
        className={cn("min-w-0", className)}
        onClick={() => handleOpenChange(true)}
      />

      <PickerSheet
        open={open}
        onOpenChange={handleOpenChange}
        variant={sheetVariant}
        title={fullscreen ? "Select guests & rooms" : "Rooms & Guests"}
        description="Adjust rooms and guest counts for your stay"
        footer={
          <Button
            type="button"
            size="lg"
            onClick={handleApply}
            className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
          >
            Apply · {formatGuestSummary(draft)}
          </Button>
        }
      >
        <GuestsPickerContent value={draft} onChange={setDraft} />
      </PickerSheet>
    </>
  );
}

export function GuestsPicker(props: GuestsPickerProps) {
  const isDesktop = useIsDesktopPicker();
  const value = normalizeGuests(props.value);
  const onChange = (guests: GuestCounts) =>
    props.onChange(normalizeGuests(guests));
  const pickerProps = { ...props, value, onChange };

  if (isDesktop === null) {
    return (
      <SearchFieldTrigger
        icon={<UsersIcon className="size-4" />}
        label={guestLabel(props.compact)}
        value={guestValue(value, props.compact)}
        compact={props.compact}
        className={cn("min-w-0", props.className)}
      />
    );
  }

  if (isDesktop) {
    return <DesktopGuestsPicker {...pickerProps} />;
  }

  return <MobileGuestsPicker {...pickerProps} />;
}
