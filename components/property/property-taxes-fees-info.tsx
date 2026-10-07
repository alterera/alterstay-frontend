"use client";

import { InfoIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency } from "@/lib/format";
import type { PropertyFeeBreakup } from "@/lib/property-fees";
import { GST_RATE } from "@/lib/property-fees";

type PropertyTaxesFeesInfoProps = {
  breakup: PropertyFeeBreakup;
  currency: string;
};

function TaxesFeesBreakdown({
  breakup,
  currency,
}: PropertyTaxesFeesInfoProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">
          Tax ({Math.round(GST_RATE * 100)}% GST)
        </span>
        <span className="font-medium">
          {formatCurrency(breakup.gstAmount, currency)}
        </span>
      </div>
      <div className="flex justify-between gap-4">
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
}: PropertyTaxesFeesInfoProps) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="View taxes and fees breakdown"
        title="View taxes and fees breakdown"
      >
        <InfoIcon className="size-3.5" strokeWidth={2} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Taxes and fees
        </p>
        <TaxesFeesBreakdown breakup={breakup} currency={currency} />
      </PopoverContent>
    </Popover>
  );
}
