"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { BookingLoginPrompt } from "@/components/booking/booking-login-prompt";
import { Container } from "@/components/common/container";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { buildBookingSummaryUrl } from "@/lib/booking-url";
import { buildPropertyUrl } from "@/lib/property-url";
import { parseSearchParams } from "@/lib/search-params";
import type { SelectedRoomPlan } from "@/types/property-detail";

type BookingLoginGatePageProps = {
  slug: string;
};

export function BookingLoginGatePage({ slug }: BookingLoginGatePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const isDesktop = useIsDesktop();
  const search = parseSearchParams(searchParams);

  const selectedPlan = useMemo<SelectedRoomPlan | null>(() => {
    const ratePlanId = searchParams.get("ratePlanId");
    const roomTypeId = searchParams.get("roomTypeId");
    if (!ratePlanId || !roomTypeId) return null;

    return {
      roomTypeId,
      roomTypeName: "",
      ratePlanId,
      ratePlanName: "",
      pricePerNight: 0,
      totalPrice: 0,
      estimatedTaxes: null,
      currency: "INR",
    };
  }, [searchParams]);

  const summaryUrl = selectedPlan
    ? buildBookingSummaryUrl(slug, search, selectedPlan)
    : `/properties/${slug}/book?${searchParams.toString()}`;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(summaryUrl);
    }
  }, [isAuthenticated, isLoading, router, summaryUrl]);

  useEffect(() => {
    if (isDesktop) {
      router.replace(summaryUrl);
    }
  }, [isDesktop, router, summaryUrl]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!searchParams.get("ratePlanId") || !searchParams.get("roomTypeId")) {
    return (
      <Container className="py-16">
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-muted-foreground">Missing booking details.</p>
          <Button render={<Link href={buildPropertyUrl(slug, search)} />} className="mt-4">
            Back to property
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-muted/20 px-4 py-8 lg:hidden">
      <Container className="px-0">
        <BookingLoginPrompt summaryUrl={summaryUrl} showBack />
      </Container>
    </div>
  );
}
