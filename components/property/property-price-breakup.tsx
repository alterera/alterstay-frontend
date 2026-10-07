"use client";

import { formatCurrency } from "@/lib/format";
import type { PropertyFeeBreakup } from "@/lib/property-fees";
import { cn } from "@/lib/utils";

import { PropertyTaxesFeesInfo } from "./property-taxes-fees-info";

type PropertyPriceBreakupProps = {
  roomTotal: number;
  currency: string;
  feeBreakup: PropertyFeeBreakup | null;
  className?: string;
  compact?: boolean;
};

export function PropertyPriceBreakup({
  roomTotal,
  currency,
  feeBreakup,
  className,
  compact = false,
}: PropertyPriceBreakupProps) {
  const total = roomTotal + (feeBreakup?.taxesAndFees ?? 0);

  return (
    <div
      className={cn(
        "rounded-md border bg-white text-sm",
        compact ? "p-0 text-xs" : "p-4",
        className,
      )}
    >
      <p
        className={cn(
          "font-semibold uppercase tracking-wide text-muted-foreground",
          compact ? "text-[10px]" : "text-xs",
        )}
      >
        Price breakup
      </p>
      <div className={cn(compact ? "mt-2 space-y-1.5" : "mt-3 space-y-2")}>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Room total</span>
          <span className="font-medium">
            {formatCurrency(roomTotal, currency)}
          </span>
        </div>
        {roomTotal > 0 && feeBreakup ? (
          <div className="flex justify-between gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              Taxes and Fees
              <PropertyTaxesFeesInfo
                breakup={feeBreakup}
                currency={currency}
              />
            </span>
            <span className="font-medium">
              {formatCurrency(feeBreakup.taxesAndFees, currency)}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t pt-2 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
    </div>
  );
}
