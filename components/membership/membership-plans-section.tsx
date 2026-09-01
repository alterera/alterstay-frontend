"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/format";
import { createMembershipPurchase } from "@/lib/membership-api";
import { openCashfreeCheckout } from "@/lib/cashfree-checkout";
import type { MembershipPlan, MembershipStatus } from "@/types/membership";
import { cn } from "@/lib/utils";

type MembershipPlansSectionProps = {
  plans: MembershipPlan[];
  status: MembershipStatus | null;
  upgradePreview: Record<string, string>;
  purchasing: string | null;
  onPurchasingChange: (code: string | null) => void;
  onError: (message: string | null) => void;
};

export function MembershipPlansSection({
  plans,
  status,
  upgradePreview,
  purchasing,
  onPurchasingChange,
  onError,
}: MembershipPlansSectionProps) {
  const router = useRouter();
  const { isAuthenticated, openLogin } = useAuth();

  const handlePurchase = useCallback(
    async (planCode: string) => {
      if (!isAuthenticated) {
        openLogin();
        return;
      }

      onPurchasingChange(planCode);
      onError(null);
      try {
        const session = await createMembershipPurchase(planCode);
        await openCashfreeCheckout({
          paymentSessionId: session.paymentSessionId,
          checkoutUrl: session.checkoutUrl,
          cashfreeMode: session.cashfreeMode,
        });
        router.push(`${ROUTES.membershipResult}?ref=${session.purchaseId}`);
      } catch (err) {
        onError(
          err instanceof Error ? err.message : "Could not start checkout",
        );
      } finally {
        onPurchasingChange(null);
      }
    },
    [isAuthenticated, onError, onPurchasingChange, openLogin, router],
  );

  return (
    <section id="membership-plans" className="scroll-mt-24">
      <h2 className="text-lg font-semibold">Membership plans</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Earn coins back after every completed stay. 1 coin = ₹1 at checkout.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const isActive = status?.active?.planCode === plan.code;
          const isCorporate = plan.code === "CORPORATE";

          return (
            <div
              key={plan.code}
              className={cn(
                "flex flex-col rounded-2xl border bg-white p-6 shadow-sm",
                isActive && "border-brand ring-1 ring-brand/20",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-2xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /year
                    </span>
                  </p>
                </div>
                {isActive ? (
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                    Active
                  </span>
                ) : null}
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {plan.benefitsDescription}
              </p>

              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-brand" />
                  Earn {plan.discountPercent}% back in coins on room base price
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-brand" />
                  Valid for {plan.durationDays} days
                </li>
                {isCorporate ? (
                  <li className="flex items-center gap-2 text-amber-800">
                    <CheckIcon className="size-4" />
                    Applies to your account only — not company-wide
                  </li>
                ) : null}
              </ul>

              {upgradePreview[plan.code] ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {upgradePreview[plan.code]}
                </p>
              ) : null}

              <div className="mt-6 flex-1" />

              <Button
                className="mt-4 w-full"
                disabled={Boolean(purchasing) || isActive}
                onClick={() => void handlePurchase(plan.code)}
              >
                {isActive
                  ? "Current plan"
                  : purchasing === plan.code
                    ? "Starting checkout…"
                    : status?.active
                      ? plan.code === "CORPORATE"
                        ? "Upgrade"
                        : "Renew"
                      : "Get membership"}
              </Button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        All membership purchases are final. Members pay full room price at
        checkout and receive coins after their stay is completed.
      </p>
    </section>
  );
}
