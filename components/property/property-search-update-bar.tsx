"use client";

import { useEffect, useState } from "react";

import { HeroSearchForm } from "@/components/sections/hero/hero-search-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatCompactDateRange,
  formatGuestSummary,
} from "@/lib/format";
import type { PropertySearchParams } from "@/types/search";

import {
  StayDatesPopover,
  StayGuestsPopover,
} from "./stay-picker-popovers";

type PropertySearchUpdateBarProps = {
  search: PropertySearchParams;
  onUpdate: (search: PropertySearchParams) => void;
};

export function PropertySearchUpdateBar({
  search,
  onUpdate,
}: PropertySearchUpdateBarProps) {
  const [draft, setDraft] = useState(search);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    setDraft(search);
  }, [search]);

  function handleUpdate() {
    onUpdate({ ...draft, guests: { ...draft.guests, children: 0 } });
  }

  function patchDraft(patch: Partial<PropertySearchParams>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function handleEditorSearch(next: PropertySearchParams) {
    const normalized = { ...next, guests: { ...next.guests, children: 0 } };
    setDraft(normalized);
    onUpdate(normalized);
    setEditorOpen(false);
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="grid sm:grid-cols-[1fr_1fr_auto]">
          {/* Desktop: open only the relevant picker */}
          <div className="hidden lg:contents">
            <StayDatesPopover
              dateRange={draft.dateRange}
              onChange={(dateRange) => patchDraft({ dateRange })}
              trigger={
                <button
                  type="button"
                  className="border-b px-4 py-3 text-left transition-colors hover:bg-muted/30 sm:border-b-0 sm:border-r"
                >
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Dates
                  </p>
                  <p className="text-sm font-medium">
                    {formatCompactDateRange(draft.dateRange)}
                  </p>
                </button>
              }
            />

            <StayGuestsPopover
              guests={draft.guests}
              onChange={(guests) => patchDraft({ guests })}
              trigger={
                <button
                  type="button"
                  className="border-b px-4 py-3 text-left transition-colors hover:bg-muted/30 sm:border-b-0 sm:border-r"
                >
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Occupancy
                  </p>
                  <p className="text-sm font-medium">
                    {formatGuestSummary(draft.guests)}
                  </p>
                </button>
              }
            />
          </div>

          {/* Mobile / tablet: full search editor sheet */}
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="border-b px-4 py-3 text-left lg:hidden sm:border-b-0 sm:border-r"
          >
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Dates
            </p>
            <p className="text-sm font-medium">
              {formatCompactDateRange(draft.dateRange)}
            </p>
          </button>
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="border-b px-4 py-3 text-left lg:hidden sm:border-b-0 sm:border-r"
          >
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Occupancy
            </p>
            <p className="text-sm font-medium">
              {formatGuestSummary(draft.guests)}
            </p>
          </button>

          <div className="flex items-center p-2">
            <Button
              type="button"
              className="w-full rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 sm:min-w-36"
              onClick={handleUpdate}
            >
              Update Search
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92dvh] overflow-y-auto rounded-t-3xl lg:hidden"
        >
          <SheetHeader className="border-b pb-4 text-left">
            <SheetTitle>Update search</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <HeroSearchForm
              defaultValues={draft}
              syncWithDefaults
              onSearch={handleEditorSearch}
              className="shadow-lg"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
