"use client";

import { ChevronRightIcon } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { BookingBill } from "@/lib/booking-url";
import { cn } from "@/lib/utils";

type BookingBillSummaryProps = {
  bill: BookingBill;
  className?: string;
};

export function BookingBillSummary({ bill, className }: BookingBillSummaryProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3.5 text-left shadow-sm transition-colors hover:bg-muted/30"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          View All Coupons
        </span>
        <ChevronRightIcon className="size-4 text-muted-foreground" />
      </button>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Your Bill Summary</h2>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Room price</dt>
            <dd className="font-medium">
              {formatCurrency(bill.roomPrice, bill.currency)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="font-medium">
              {formatCurrency(bill.tax, bill.currency)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-end justify-between border-t pt-4">
          <div>
            <p className="font-semibold">To Pay</p>
            <p className="text-xs text-muted-foreground">
              (Inclusive of all Taxes)
            </p>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {formatCurrency(bill.toPay, bill.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
