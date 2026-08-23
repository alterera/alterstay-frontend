"use client";

import { Loader2Icon } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { BookingBill } from "@/lib/booking-url";
import { cn } from "@/lib/utils";

type BookingMobilePayDockProps = {
  bill: BookingBill;
  onPay: () => void;
  className?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
};

export function BookingMobilePayDock({
  bill,
  onPay,
  className,
  disabled = false,
  isSubmitting = false,
}: BookingMobilePayDockProps) {
  return (
    <div className={cn("fixed inset-x-0 bottom-0 z-50 lg:hidden", className)}>
      <div className="border-t bg-white px-4 py-3 shadow-[0_-10px_40px_rgba(15,23,42,0.12)]">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">To Pay</p>
            <p className="text-xl font-bold tracking-tight">
              {formatCurrency(bill.toPay, bill.currency)}
            </p>
          </div>

          <button
            type="button"
            onClick={onPay}
            disabled={disabled || isSubmitting}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Processing…
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
