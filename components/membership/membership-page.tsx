"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { MembershipBreadcrumb } from "@/components/membership/membership-breadcrumb";
import { MembershipHero } from "@/components/membership/membership-hero";
import { MembershipHistoryTable } from "@/components/membership/membership-history-table";
import { MembershipOverview } from "@/components/membership/membership-overview";
import { MembershipPlansSection } from "@/components/membership/membership-plans-section";
import { ROUTES } from "@/constants/routes";
import {
  fetchMembershipPlans,
  fetchMyMembership,
  fetchUpgradePreview,
} from "@/lib/membership-api";
import type { MembershipPlan, MembershipStatus } from "@/types/membership";

export function MembershipPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
    const corporate = plans.find((p) => p.code === "CORPORATE");
    if (!corporate || status.active.planCode === "CORPORATE") return;

    void fetchUpgradePreview("CORPORATE")
      .then((preview) => {
        setUpgradePreview((prev) => ({
          ...prev,
          CORPORATE: `Your remaining value converts to ~${preview.bonusDays} bonus days. Total: ${preview.totalDays} days.`,
        }));
      })
      .catch(() => undefined);
  }, [isAuthenticated, status, plans]);

  const showAuthenticatedSections = isAuthenticated && !authLoading;

  return (
    <section className="bg-background pb-12">
      <MembershipHero status={status} loading={loading || authLoading} />
      <MembershipBreadcrumb />

      <Container className="mt-6 max-w-4xl space-y-8">
        {error ? (
          <p className="text-center text-sm text-destructive">{error}</p>
        ) : null}

        {showAuthenticatedSections ? (
          <>
            <MembershipOverview status={status} loading={loading} />
            <MembershipHistoryTable
              periods={status?.periods ?? []}
              loading={loading}
            />
          </>
        ) : !authLoading ? (
          <p className="text-center text-sm text-muted-foreground">
            <Link href={ROUTES.auth.login} className="font-medium text-brand underline">
              Sign in
            </Link>{" "}
            to see your membership overview and history.
          </p>
        ) : null}

        {loading ? (
          <p className="text-center text-sm text-muted-foreground">
            Loading plans…
          </p>
        ) : (
          <MembershipPlansSection
            plans={plans}
            status={status}
            upgradePreview={upgradePreview}
            purchasing={purchasing}
            onPurchasingChange={setPurchasing}
            onError={setError}
          />
        )}

        <p className="text-center text-xs text-muted-foreground">
          See{" "}
          <Link href={ROUTES.terms} className="underline">
            Terms
          </Link>{" "}
          for details.
        </p>
      </Container>
    </section>
  );
}
