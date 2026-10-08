"use client";

import { InfoIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency } from "@/lib/format";
import type { PropertyFeeBreakup } from "@/lib/property-fees";
import { cn } from "@/lib/utils";

type PropertyTaxesFeesInfoProps = {
  breakup: PropertyFeeBreakup;
  currency: string;
  compact?: boolean;
};

function TaxesFeesBreakdown({
  breakup,
  currency,
  compact = false,
}: PropertyTaxesFeesInfoProps) {
  return (
    <div className={cn("space-y-1.5", compact ? "text-[11px]" : "text-sm")}>
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">Tax (18% GST)</span>
        <span className="font-medium">
          {formatCurrency(breakup.gstAmount, currency)}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-muted-foreground">Platform charge</span>
        <span className="font-medium">
          {formatCurrency(breakup.platformFee, currency)}
        </span>
      </div>
    </div>
  );
}

export function PropertyTaxesFeesInfo({
  breakup,
  currency,
  compact = false,
}: PropertyTaxesFeesInfoProps) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          compact ? "size-4" : "size-5",
        )}
        aria-label="View taxes and fees breakdown"
        title="View taxes and fees breakdown"
      >
        <InfoIcon
          className={compact ? "size-2.5" : "size-3.5"}
          strokeWidth={2}
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(compact ? "w-48 p-2" : "w-64 p-3")}
      >
        <p
          className={cn(
            "mb-1.5 font-semibold uppercase tracking-wide text-muted-foreground",
            compact ? "text-[10px]" : "text-xs",
          )}
        >
          Taxes and fees
        </p>
        <TaxesFeesBreakdown
          breakup={breakup}
          currency={currency}
          compact={compact}
        />
      </PopoverContent>
    </Popover>
  );
}
