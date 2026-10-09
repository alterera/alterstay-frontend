"use client";

import { Separator } from "@/components/ui/separator";
import type { GuestCounts } from "@/types/search";

import { GuestCounterRow } from "./guest-counter-row";

type GuestsPickerContentProps = {
  value: GuestCounts;
  onChange: (guests: GuestCounts) => void;
  dense?: boolean;
};

export function GuestsPickerContent({
  value,
  onChange,
  dense = false,
}: GuestsPickerContentProps) {
  function updateGuestCount(key: keyof GuestCounts, delta: number) {
    onChange({
      ...value,
      [key]: Math.max(key === "rooms" ? 1 : 0, value[key] + delta),
    });
  }

  return (
    <div className={dense ? "space-y-0.5" : "space-y-1"}>
      <GuestCounterRow
        label="Rooms"
        description="Number of rooms needed"
        value={value.rooms}
        min={1}
        dense={dense}
        onDecrement={() => updateGuestCount("rooms", -1)}
        onIncrement={() => updateGuestCount("rooms", 1)}
      />
      <Separator />
      <GuestCounterRow
        label="Adults"
        description="Ages 13 or above"
        value={value.adults}
        min={1}
        dense={dense}
        onDecrement={() => updateGuestCount("adults", -1)}
        onIncrement={() => updateGuestCount("adults", 1)}
      />
    </div>
  );
}
