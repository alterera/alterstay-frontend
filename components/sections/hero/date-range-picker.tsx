"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  describeDateRange,
  nextDateRangeForDay,
  startOfToday,
} from "@/lib/date-range";
import {
  formatDateRange,
  formatNavDateRange,
  formatSingleDate,
} from "@/lib/format";
import type { DateRange } from "@/types/search";
import { cn } from "@/lib/utils";

import {
  DateRangeSheetCalendar,
  DateRangeWeekdayHeader,
} from "./date-range-sheet-calendar";
import { PickerSheet, type PickerSheetVariant } from "./picker-sheet";
import { SearchFieldTrigger } from "./search-field-trigger";
import { useIsDesktopPicker } from "./use-is-desktop-picker";

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  compact?: boolean;
  /** `combined` keeps check-in and check-out in a single morphable field. */
  layout?: "split" | "combined";
  sheetVariant?: PickerSheetVariant;
};

type DateFieldKey = "from" | "to";

function CombinedDateRangePicker({
  value,
  onChange,
  className,
  compact,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const today = startOfToday();

  function handleDayClick(day: Date) {
    const next = nextDateRangeForDay(value, day);
    onChange(next);

    if (next.from && next.to) {
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <SearchFieldTrigger
            icon={<CalendarIcon className="size-4" />}
            label="Check-in & check-out"
            value={formatNavDateRange(value)}
            compact={compact}
            className={cn("min-w-0", className)}
          />
        }
      />
      <PopoverContent
        align="start"
        className="max-h-[80vh] w-auto max-w-[calc(100vw-1rem)] overflow-auto rounded-2xl p-0"
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={(_range, triggerDate) => handleDayClick(triggerDate)}
          numberOfMonths={2}
          defaultMonth={value.from ?? today}
          disabled={{ before: today }}
          className="p-3 md:[--cell-size:--spacing(9)]"
        />
      </PopoverContent>
    </Popover>
  );
}

function SplitDateRangePicker({
  value,
  onChange,
  className,
  compact,
}: DateRangePickerProps) {
  const [openField, setOpenField] = useState<DateFieldKey | null>(null);
  const today = startOfToday();

  function handleFromSelect(date: Date | undefined) {
    if (!date) {
      onChange({ from: undefined, to: value.to });
      return;
    }

    const nextTo =
      value.to && value.to.getTime() <= date.getTime() ? undefined : value.to;

    onChange({ from: date, to: nextTo });

    if (nextTo) {
      setOpenField(null);
    } else {
      setOpenField("to");
    }
  }

  function handleToSelect(date: Date | undefined) {
    if (!date) {
      onChange({ from: value.from, to: undefined });
      return;
    }

    if (value.from && date.getTime() <= value.from.getTime()) {
      onChange({ from: value.from, to: undefined });
      return;
    }

    onChange({ from: value.from, to: date });
    setOpenField(null);
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center",
        className,
      )}
    >
      <Popover
        open={openField === "from"}
        onOpenChange={(open) => setOpenField(open ? "from" : null)}
      >
        <PopoverTrigger
          render={
            <SearchFieldTrigger
              icon={<CalendarIcon className="size-4" />}
              label="From"
              value={formatSingleDate(value.from, "Check-in")}
              compact={compact}
              className="min-w-0 sm:flex-1"
            />
          }
        />
        <PopoverContent
          align="start"
          className="max-h-[80vh] w-auto max-w-[calc(100vw-1rem)] overflow-auto rounded-2xl p-0"
        >
          <Calendar
            mode="single"
            selected={value.from}
            onSelect={handleFromSelect}
            defaultMonth={value.from ?? today}
            disabled={{ before: today }}
            className="p-3 md:[--cell-size:--spacing(8)]"
          />
        </PopoverContent>
      </Popover>

      <Separator className="sm:hidden" />
      <Separator
        orientation="vertical"
        className="mx-1 hidden self-center data-vertical:h-10 sm:block"
      />

      <Popover
        open={openField === "to"}
        onOpenChange={(open) => setOpenField(open ? "to" : null)}
      >
        <PopoverTrigger
          render={
            <SearchFieldTrigger
              icon={<CalendarIcon className="size-4" />}
              label="To"
              value={formatSingleDate(value.to, "Check-out")}
              compact={compact}
              className="min-w-0 sm:flex-1"
            />
          }
        />
        <PopoverContent
          align="start"
          className="max-h-[80vh] w-auto max-w-[calc(100vw-1rem)] overflow-auto rounded-2xl p-0"
        >
          <Calendar
            mode="single"
            selected={value.to}
            onSelect={handleToSelect}
            defaultMonth={value.to ?? value.from ?? today}
            disabled={{
              before: value.from
                ? new Date(value.from.getTime() + 24 * 60 * 60 * 1000)
                : today,
            }}
            className="p-3 md:[--cell-size:--spacing(8)]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function MobileDateRangePicker({
  value,
  onChange,
  className,
  compact,
  sheetVariant = "sheet",
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);

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
        icon={<CalendarIcon className="size-4" />}
        label="Dates"
        value={formatDateRange(value)}
        compact={compact}
        className={cn("min-w-0", className)}
        onClick={() => handleOpenChange(true)}
      />

      <PickerSheet
        open={open}
        onOpenChange={handleOpenChange}
        variant={sheetVariant}
        title="Check-in & check-out dates"
        description="Tap a day to set check-in, then tap another to set check-out"
        stickyContent={<DateRangeWeekdayHeader />}
        footer={
          <div className="space-y-2.5">
            <p className="text-center text-xs font-medium text-foreground">
              {describeDateRange(draft)}
            </p>
            <Button
              type="button"
              size="lg"
              onClick={handleApply}
              disabled={!draft.from || !draft.to}
              className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
            >
              Apply dates
            </Button>
          </div>
        }
      >
        <DateRangeSheetCalendar
          value={draft}
          onDayClick={(day) =>
            setDraft((current) => nextDateRangeForDay(current, day))
          }
        />
      </PickerSheet>
    </>
  );
}

export function DateRangePicker(props: DateRangePickerProps) {
  const isDesktop = useIsDesktopPicker();
  const combined = props.layout === "combined";

  if (isDesktop === null) {
    return (
      <SearchFieldTrigger
        icon={<CalendarIcon className="size-4" />}
        label={combined ? "Check-in & check-out" : "Dates"}
        value={
          combined ? formatNavDateRange(props.value) : formatDateRange(props.value)
        }
        compact={props.compact}
        className={cn("min-w-0", props.className)}
      />
    );
  }

  if (combined) {
    return <CombinedDateRangePicker {...props} />;
  }

  if (isDesktop) {
    return <SplitDateRangePicker {...props} />;
  }

  return <MobileDateRangePicker {...props} />;
}
