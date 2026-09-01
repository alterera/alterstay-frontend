import { ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";

import type { AlterCashTransaction } from "@/lib/alter-cash-api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type WalletTransactionHistoryProps = {
  transactions: AlterCashTransaction[];
};

function formatTxDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function txLabel(type: string, description: string) {
  switch (type) {
    case "EARN":
      return "Coins earned";
    case "REDEEM":
      return "Coins redeemed";
    case "REDEEM_REFUND":
      return "Coins refunded";
    case "ADJUST":
      return "Balance adjusted";
    default:
      return description;
  }
}

export function WalletTransactionHistory({
  transactions,
}: WalletTransactionHistoryProps) {
  return (
    <div className="rounded-md border bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold">Transaction history</h2>

      {transactions.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No transactions yet. Book a stay as a member to start earning coins.
        </p>
      ) : (
        <div className="mt-4 max-h-[420px] overflow-y-auto pr-1">
          <ul className="divide-y">
            {transactions.map((tx) => {
              const credit = tx.amount >= 0;
              return (
                <li
                  key={tx.id}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-4 text-sm sm:grid-cols-[auto_1fr_100px_90px] sm:gap-4"
                >
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    A
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border border-white",
                        credit ? "bg-emerald-500 text-white" : "bg-orange-500 text-white",
                      )}
                    >
                      {credit ? (
                        <ArrowDownLeftIcon className="size-2.5" />
                      ) : (
                        <ArrowUpRightIcon className="size-2.5" />
                      )}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {txLabel(tx.type, tx.description)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground sm:hidden">
                      {formatTxDate(tx.createdAt)}
                    </p>
                  </div>

                  <p className="hidden text-center text-muted-foreground sm:block">
                    {formatTxDate(tx.createdAt)}
                  </p>

                  <p
                    className={cn(
                      "text-right font-semibold",
                      credit ? "text-emerald-700" : "text-foreground",
                    )}
                  >
                    {credit ? "+" : "-"}
                    {formatCurrency(Math.abs(tx.amount)).replace("₹", "")} Pts
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
