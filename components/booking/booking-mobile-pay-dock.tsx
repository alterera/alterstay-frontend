"use client";

import { ChevronRightIcon, Loader2Icon } from "lucide-react";

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
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-white pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">To Pay</p>
          <p className="text-lg font-bold leading-tight tracking-tight">
            {formatCurrency(bill.toPay, bill.currency)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Inclusive of all taxes
          </p>
        </div>

        <button
          type="button"
          onClick={onPay}
          disabled={disabled || isSubmitting}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-md bg-brand px-4 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              Proceed To Book
              <ChevronRightIcon className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
