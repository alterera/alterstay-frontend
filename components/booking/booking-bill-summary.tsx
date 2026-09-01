"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { BookingBill } from "@/lib/booking-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BookingBillSummaryProps = {
  bill: BookingBill;
  className?: string;
  showMembershipUpsell?: boolean;
  coinsBalance?: number;
  maxCoinsRedeemable?: number;
  coinsToRedeem?: number;
  onCoinsToRedeemChange?: (value: number) => void;
  coinsInputDisabled?: boolean;
};

export function BookingBillSummary({
  bill,
  className,
  showMembershipUpsell = false,
  coinsBalance,
  maxCoinsRedeemable,
  coinsToRedeem = 0,
  onCoinsToRedeemChange,
  coinsInputDisabled = false,
}: BookingBillSummaryProps) {
  const canRedeem =
    typeof coinsBalance === "number" &&
    coinsBalance > 0 &&
    typeof onCoinsToRedeemChange === "function";

  return (
    <div className={cn("space-y-4", className)}>
      {showMembershipUpsell ? (
        <Link
          href="/membership"
          className="flex w-full items-center justify-between rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3.5 text-left shadow-sm transition-colors hover:bg-brand/10"
        >
          <span className="flex flex-col gap-0.5 text-sm">
            <span className="font-medium text-brand">
              Earn with AlterStay Membership
            </span>
            <span className="text-xs text-muted-foreground">
              Members earn up to 10% back in coins after their stay
            </span>
          </span>
          <ChevronRightIcon className="size-4 text-brand" />
        </Link>
      ) : null}

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Your Bill Summary</h2>

        {canRedeem ? (
          <div className="mt-4 rounded-xl border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-2 text-sm">
              <Label htmlFor="coins-to-redeem" className="font-medium">
                Apply coins
              </Label>
              <span className="text-muted-foreground">
                Balance: {coinsBalance.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Input
                id="coins-to-redeem"
                type="number"
                min={0}
                max={maxCoinsRedeemable ?? coinsBalance}
                value={coinsToRedeem || ""}
                placeholder="0"
                disabled={coinsInputDisabled}
                onChange={(event) => {
                  const raw = event.target.value;
                  const next = raw === "" ? 0 : Number(raw);
                  if (!Number.isFinite(next) || next < 0) return;
                  const cap = maxCoinsRedeemable ?? coinsBalance;
                  onCoinsToRedeemChange(Math.min(next, cap));
                }}
              />
              <button
                type="button"
                className="shrink-0 text-xs font-medium text-brand underline disabled:opacity-50"
                disabled={coinsInputDisabled}
                onClick={() =>
                  onCoinsToRedeemChange(maxCoinsRedeemable ?? coinsBalance)
                }
              >
                Use max
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Max {maxCoinsRedeemable ?? coinsBalance} coins (1 coin = ₹1)
            </p>
          </div>
        ) : null}

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Room price</dt>
            <dd className="font-medium">
              {formatCurrency(bill.roomPrice, bill.currency)}
            </dd>
          </div>
          {(bill.coinsApplied ?? 0) > 0 ? (
            <div className="flex justify-between gap-4 text-emerald-700">
              <dt>Coins applied</dt>
              <dd className="font-medium">
                -{formatCurrency(bill.coinsApplied ?? 0, bill.currency)}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="font-medium">
              {formatCurrency(bill.tax, bill.currency)}
            </dd>
          </div>
        </dl>

        {bill.coinEarnPreview && bill.coinEarnPreview.earnableAmount > 0 ? (
          <p className="mt-4 rounded-lg bg-brand/5 px-3 py-2 text-xs text-brand">
            You&apos;ll earn {bill.coinEarnPreview.earnableAmount.toLocaleString("en-IN")}{" "}
            coins after your stay ({bill.coinEarnPreview.earnPercent}% back)
          </p>
        ) : null}

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
