"use client";

import { CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types/search-results";

type SearchSortSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortBy: SortOption;
  onChange: (sortBy: SortOption) => void;
};

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price_asc", label: "Lowest Price First" },
  { id: "price_desc", label: "Highest Price First" },
  { id: "rating_desc", label: "Ratings" },
];

export function SearchSortSheet({
  open,
  onOpenChange,
  sortBy,
  onChange,
}: SearchSortSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="inset-x-0 bottom-0 h-auto max-h-[70dvh] w-full gap-0 overflow-hidden rounded-t-xl border-0 bg-background p-0 shadow-none data-[side=bottom]:h-auto"
      >
        <div className="flex min-h-0 flex-col pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <header className="shrink-0 border-b bg-background px-5 pb-3 pt-3">
            <div className="mb-3 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-muted-foreground/25" />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label="Close sort"
              >
                <XIcon className="size-5" />
              </Button>
              <SheetTitle className="text-lg font-semibold tracking-tight">
                Sort by
              </SheetTitle>
              <SheetDescription className="sr-only">
                Choose how search results are ordered
              </SheetDescription>
            </div>
          </header>

          <div className="px-2 py-2">
            {SORT_OPTIONS.map((option) => {
              const selected = sortBy === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left text-sm",
                    selected ? "bg-muted font-semibold" : "font-medium",
                  )}
                >
                  {option.label}
                  {selected ? <CheckIcon className="size-4 text-brand" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
