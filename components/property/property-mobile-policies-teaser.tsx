"use client";

import { useState } from "react";
import { ChevronRightIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPropertyTime } from "@/lib/format";
import type { PropertyPolicyDetail } from "@/types/property-detail";

import { PropertyPoliciesSection } from "./property-policies-section";

type PropertyMobilePoliciesTeaserProps = {
  policies: PropertyPolicyDetail[];
  checkInTime: string | null;
  checkOutTime: string | null;
};

export function PropertyMobilePoliciesTeaser({
  policies,
  checkInTime,
  checkOutTime,
}: PropertyMobilePoliciesTeaserProps) {
  const [open, setOpen] = useState(false);
  const checkIn = formatPropertyTime(checkInTime) || "—";
  const checkOut = formatPropertyTime(checkOutTime) || "—";

  return (
    <>
      <div className="space-y-4 lg:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Policies
          </p>
          <h2 className="mt-1 text-xl font-semibold">Things you must know</h2>
        </div>
        <div className="rounded-md border bg-white px-4 py-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Check-in
              </p>
              <p className="mt-0.5 font-semibold">{checkIn}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Check-out
              </p>
              <p className="mt-0.5 font-semibold">{checkOut}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 flex w-full items-center justify-between text-sm font-medium text-brand"
          >
            View all rules
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex max-h-[70vh] flex-col rounded-t-2xl p-0"
        >
          <SheetHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <SheetTitle className="text-base">Hotel policies</SheetTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <PropertyPoliciesSection
              policies={policies}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              embedded
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
