"use client";

import { HeroSearchForm } from "@/components/sections/hero/hero-search-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PropertySearchParams } from "@/types/search";

type MobileSearchEditSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: PropertySearchParams;
  onSearch: (params: PropertySearchParams) => void;
};

export function MobileSearchEditSheet({
  open,
  onOpenChange,
  search,
  onSearch,
}: MobileSearchEditSheetProps) {
  function handleSearch(params: PropertySearchParams) {
    onSearch(params);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="max-h-[92dvh] overflow-y-auto rounded-b-3xl border-b p-0 pb-[env(safe-area-inset-top)]"
      >
        <SheetHeader className="border-b px-4 py-4 text-left">
          <SheetTitle className="text-lg font-semibold">Edit search</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <HeroSearchForm
            defaultValues={search}
            syncWithDefaults
            onSearch={handleSearch}
            mobilePickerVariant="fullscreen"
            className="shadow-lg"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
