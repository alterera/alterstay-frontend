"use client";

import { useRef } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * `sheet` is the landing-page bottom sheet. `fullscreen` fills the viewport so
 * the picker reads as its own page, which is what the search results page uses.
 */
export type PickerSheetVariant = "sheet" | "fullscreen";

type PickerSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: PickerSheetVariant;
  /** Pinned between the header and the scroll area. */
  stickyContent?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function PickerSheet({
  open,
  onOpenChange,
  title,
  description,
  variant = "sheet",
  stickyContent,
  children,
  footer,
  className,
}: PickerSheetProps) {
  // Parking focus on the shell rather than the first field stops mobile
  // browsers from raising the keyboard as soon as the sheet opens.
  const shellRef = useRef<HTMLDivElement>(null);
  const fullscreen = variant === "fullscreen";
  const gutter = fullscreen ? "px-4" : "px-5";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        initialFocus={shellRef}
        className={cn(
          "flex flex-col gap-0 border-0 p-0 pb-[env(safe-area-inset-bottom)]",
          fullscreen
            ? "inset-0 rounded-none data-[side=bottom]:h-dvh data-[side=bottom]:max-h-dvh data-[side=bottom]:border-t-0 data-[side=bottom]:data-ending-style:translate-y-full data-[side=bottom]:data-starting-style:translate-y-full pt-[env(safe-area-inset-top)]"
            : "max-h-[92dvh] min-h-[80dvh] rounded-t-[1.75rem]",
          className,
        )}
      >
        <div
          ref={shellRef}
          tabIndex={-1}
          className="flex min-h-0 flex-1 flex-col outline-none"
        >
          {fullscreen ? (
            <SheetHeader className="shrink-0 flex-row items-center gap-2 border-b border-border/60 px-2 py-2.5 text-left">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
                className="size-9 shrink-0 rounded-full"
              >
                <XIcon className="size-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-base font-semibold">
                  {title}
                </SheetTitle>
              </div>
              {description ? (
                <SheetDescription className="sr-only">
                  {description}
                </SheetDescription>
              ) : null}
            </SheetHeader>
          ) : (
            <>
              <div className="flex shrink-0 flex-col items-center pt-3">
                <div
                  aria-hidden="true"
                  className="h-1 w-10 rounded-full bg-border"
                />
              </div>

              <SheetHeader className="shrink-0 border-b border-border/60 px-5 pb-4 pt-3 text-left">
                <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
                {description ? (
                  <SheetDescription className="text-sm">
                    {description}
                  </SheetDescription>
                ) : null}
              </SheetHeader>
            </>
          )}

          {stickyContent ? (
            <div
              className={cn(
                "shrink-0 border-b border-border/60 bg-popover py-3",
                gutter,
              )}
            >
              {stickyContent}
            </div>
          ) : null}

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain py-4",
              gutter,
            )}
          >
            {children}
          </div>

          {footer ? (
            <div
              className={cn(
                "shrink-0 border-t border-border/60 bg-popover py-3",
                gutter,
              )}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
