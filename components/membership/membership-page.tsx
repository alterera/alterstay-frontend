"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/common/container";
import { MembershipAside } from "@/components/membership/membership-aside";
import { MembershipBreadcrumb } from "@/components/membership/membership-breadcrumb";
import { MembershipHero } from "@/components/membership/membership-hero";
import { MembershipHistoryTable } from "@/components/membership/membership-history-table";
import { MembershipOverview } from "@/components/membership/membership-overview";
import { ROUTES } from "@/constants/routes";
import { fetchMyMembership } from "@/lib/membership-api";
import type { MembershipStatus } from "@/types/membership";

function MembershipPageContent() {
  const [status, setStatus] = useState<MembershipStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const membership = await fetchMyMembership();
        if (!cancelled) setStatus(membership);
      } catch {
        if (!cancelled) setError("Could not load membership details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-muted/20 pb-14">
      <MembershipHero status={status} loading={loading} />
      <MembershipBreadcrumb />

      <Container className="mt-8 max-w-6xl">
        {error ? (
          <p className="mb-6 text-center text-sm text-destructive">{error}</p>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-10">
            <MembershipOverview status={status} loading={loading} />
            <MembershipHistoryTable
              periods={status?.periods ?? []}
              loading={loading}
            />
          </div>

          <MembershipAside status={status} loading={loading} />
        </div>
      </Container>
    </section>
  );
}

export function MembershipPage() {
  return (
    <RequireAuth>
      <MembershipPageContent />
    </RequireAuth>
  );
}
