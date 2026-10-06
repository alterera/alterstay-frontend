"use client";

import { HeroSearchForm } from "@/components/sections/hero/hero-search-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PropertySearchParams } from "@/types/search";

type PropertyStayEditSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  search: PropertySearchParams;
  onUpdate: (params: PropertySearchParams) => void;
};

export function PropertyStayEditSheet({
  open,
  onOpenChange,
  search,
  onUpdate,
}: PropertyStayEditSheetProps) {
  function handleUpdate(params: PropertySearchParams) {
    onUpdate(params);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="max-h-[92dvh] overflow-y-auto rounded-b-3xl border-b p-0 pb-[env(safe-area-inset-top)]"
      >
        <SheetHeader className="border-b px-4 py-4 text-left">
          <SheetTitle className="text-lg font-semibold">Edit stay</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <HeroSearchForm
            defaultValues={search}
            syncWithDefaults
            onSearch={handleUpdate}
            mobilePickerVariant="fullscreen"
            hideCity
            searchButtonLabel="Update"
            className="shadow-lg"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
