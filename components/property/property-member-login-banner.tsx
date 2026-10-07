"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type PropertyMemberLoginBannerProps = {
  savingsAmount: number;
  currency: string;
  className?: string;
};

export function PropertyMemberLoginBanner({
  savingsAmount,
  currency,
  className,
}: PropertyMemberLoginBannerProps) {
  const { isAuthenticated, openLogin } = useAuth();

  if (isAuthenticated || savingsAmount <= 0) return null;

  return (
    <button
      type="button"
      onClick={openLogin}
      className={cn(
        "w-full bg-brand px-3 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-brand-foreground transition-colors hover:bg-brand/90",
        className,
      )}
    >
      Login to save upto {formatCurrency(savingsAmount, currency)}
    </button>
  );
}
