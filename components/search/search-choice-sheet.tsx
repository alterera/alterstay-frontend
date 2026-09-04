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

type SortChoice = { id: SortOption; label: string };

type SearchChoiceSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  value: SortOption;
  options: SortChoice[];
  onChange: (value: SortOption) => void;
};

export function SearchChoiceSheet({
  open,
  onOpenChange,
  title,
  description,
  value,
  options,
  onChange,
}: SearchChoiceSheetProps) {
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
                aria-label={`Close ${title}`}
              >
                <XIcon className="size-5" />
              </Button>
              <SheetTitle className="text-lg font-semibold tracking-tight">
                {title}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {description}
              </SheetDescription>
            </div>
          </header>

          <div className="px-2 py-2">
            {options.map((option) => {
              const selected = value === option.id;
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

export const MOBILE_SORT_OPTIONS: SortChoice[] = [
  { id: "price_asc", label: "Price low to high" },
  { id: "price_desc", label: "Price high to low" },
  { id: "rating_desc", label: "Ratings" },
];

export const MOBILE_PRICE_OPTIONS: SortChoice[] = [
  { id: "price_asc", label: "Low to High" },
  { id: "price_desc", label: "High to Low" },
];
