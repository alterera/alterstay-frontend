"use client";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type PropertyPriceBreakupProps = {
  roomTotal: number;
  taxes: number;
  currency: string;
  className?: string;
};

export function PropertyPriceBreakup({
  roomTotal,
  taxes,
  currency,
  className,
}: PropertyPriceBreakupProps) {
  const total = roomTotal + taxes;

  return (
    <div className={cn("rounded-md border bg-white p-4 text-sm", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Price breakup
      </p>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Room total</span>
          <span className="font-medium">{formatCurrency(roomTotal, currency)}</span>
        </div>
        {taxes > 0 ? (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Taxes</span>
            <span className="font-medium">{formatCurrency(taxes, currency)}</span>
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
