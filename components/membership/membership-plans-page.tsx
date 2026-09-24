"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2Icon, UserIcon, XIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { MembershipPlansSkeleton } from "@/components/skeletons";
import Pricing from "@/components/ui/pricing";
import type { PricingColumnProps } from "@/components/ui/pricing-utils/pricing-column";
import { openCashfreeCheckout } from "@/lib/cashfree-checkout";
import {
  createMembershipPurchase,
  fetchMembershipPlans,
  fetchMyMembership,
  fetchUpgradePreview,
} from "@/lib/membership-api";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { MembershipPlan, MembershipStatus } from "@/types/membership";

const PLAN_COPY: Record<
  string,
  {
    description: string;
    features: string[];
    icon: ReactNode;
    variant: PricingColumnProps["variant"];
  }
> = {
  INDIVIDUAL: {
    description: "For travellers who want savings on every personal stay",
    features: [
      "5% discount on every booking",
      "Inclusive festival and birthday offers",
      "Free Membership Renewal",
      "12 Months Validity",
    ],
    icon: <UserIcon className="size-4" />,
    variant: "glow-brand",
  },
  CORPORATE: {
    description: "For frequent travellers who want maximum member benefits",
    features: [
      "10% discount on every booking",
      "Reward stays algorithm",
      "Exclusive Benefits",
      "Partnered Coupons",
      "Free Membership Renewal",
      "12 Months Validity",
    ],
    icon: <Building2Icon className="size-4" />,
    variant: "glow",
  },
};

export function MembershipPlansPage() {
  const router = useRouter();
  const { isAuthenticated, openLogin } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [status, setStatus] = useState<MembershipStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [upgradePreview, setUpgradePreview] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const planList = await fetchMembershipPlans();
        if (!cancelled) setPlans(planList);
        if (isAuthenticated) {
          const membership = await fetchMyMembership();
          if (!cancelled) setStatus(membership);
        } else if (!cancelled) {
          setStatus(null);
        }
      } catch {
        if (!cancelled) setError("Could not load membership plans.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !status?.active) return;
    if (status.active.planCode === "CORPORATE") return;

    void fetchUpgradePreview("CORPORATE")
      .then((preview) => {
        setUpgradePreview((prev) => ({
          ...prev,
          CORPORATE: `Your remaining value converts to ~${preview.bonusDays} bonus days. Total: ${preview.totalDays} days.`,
        }));
      })
      .catch(() => undefined);
  }, [isAuthenticated, status]);

  const handlePurchase = useCallback(
    async (planCode: string) => {
      if (!isAuthenticated) {
        openLogin();
        return;
      }

      setPurchasing(planCode);
      setError(null);
      try {
        const session = await createMembershipPurchase(planCode);
        await openCashfreeCheckout({
          paymentSessionId: session.paymentSessionId,
          checkoutUrl: session.checkoutUrl,
          cashfreeMode: session.cashfreeMode,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not start checkout",
        );
        setPurchasing(null);
      }
    },
    [isAuthenticated, openLogin],
  );

  const pricingPlans = useMemo(() => {
    return plans.map((plan): PricingColumnProps => {
      const copy = PLAN_COPY[plan.code] ?? {
        description: plan.benefitsDescription ?? "Membership",
        features: [
          `Earn ${plan.discountPercent}% back in coins on room base price`,
          `Valid for ${plan.durationDays} days`,
        ],
        icon: <UserIcon className="size-4" />,
        variant: "default" as const,
      };
      const isActive = status?.active?.planCode === plan.code;
      const noteParts = [
        upgradePreview[plan.code],
      ].filter(Boolean);

      return {
        name: plan.name,
        icon: copy.icon,
        description: copy.description,
        price: plan.price,
        priceNote: noteParts.join(" · ") || undefined,
        features: copy.features,
        variant: copy.variant,
        cta: {
          variant: plan.code === "INDIVIDUAL" ? "glow-brand" : "glow",
          label: isActive
            ? "Current plan"
            : purchasing === plan.code
              ? "Starting checkout…"
              : status?.active
                ? plan.code === "CORPORATE"
                  ? "Upgrade"
                  : "Renew"
                : "Upgrade membership",
          disabled: Boolean(purchasing) || isActive,
          onClick: () => void handlePurchase(plan.code),
        },
      };
    });
  }, [handlePurchase, plans, purchasing, status, upgradePreview]);

  function handleClose() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(isAuthenticated ? ROUTES.membership : ROUTES.home);
  }

  return (
    <div className="relative bg-background pb-8">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-4 top-4 z-10 rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur sm:right-6 sm:top-6"
        onClick={handleClose}
        aria-label="Close plans"
      >
        <XIcon className="size-4" />
      </Button>
      {error ? (
        <p className="px-4 pt-2 text-center text-sm text-destructive">{error}</p>
      ) : null}
      {loading ? (
        <MembershipPlansSkeleton />
      ) : (
        <Pricing
          title="Available Plans"
          plans={pricingPlans}
        />
      )}
    </div>
  );
}
