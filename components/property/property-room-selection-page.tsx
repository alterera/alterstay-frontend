"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { PropertyPageSkeleton } from "@/components/skeletons";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { usePropertySearchDefaults } from "@/hooks/use-property-search-defaults";
import {
  buildCheckoutLoginUrl,
  buildCheckoutUrl,
} from "@/lib/booking-url";
import { fetchQuote } from "@/lib/quote-api";
import { quoteToBill } from "@/lib/quote-utils";
import { fetchPropertyDetail } from "@/lib/property-api";
import { findLowestPricePlan } from "@/lib/property-booking";
import { buildPropertyRoomsUrl, buildPropertyUrl } from "@/lib/property-url";
import {
  parseSearchParams,
  formatDateParam,
  resolvePropertySearchParams,
} from "@/lib/search-params";
import type { PropertyDetail, SelectedRoomPlan } from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";
import type { QuoteResponse } from "@/types/quote";

import { PropertyMobileStayHeader } from "./property-mobile-stay-header";
import { PropertyPriceBreakup } from "./property-price-breakup";
import { PropertyRoomList } from "./property-room-list";
import { PropertyRoomSelectionDock } from "./property-room-selection-dock";

type PropertyRoomSelectionPageProps = {
  slug: string;
};

export function PropertyRoomSelectionPage({ slug }: PropertyRoomSelectionPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isDesktop = useIsDesktop();

  const [search, setSearch] = useState<PropertySearchParams>(() => {
    const parsed = parseSearchParams(searchParams);
    return resolvePropertySearchParams({
      city: parsed.city,
      dateRange: parsed.dateRange,
      guests: parsed.guests,
    });
  });
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedRoomPlan | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  usePropertySearchDefaults({ slug, buildUrl: buildPropertyRoomsUrl });

  const loadProperty = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertyDetail(slug, search);
      setProperty(data);
      setSelectedPlan(findLowestPricePlan(data));
    } catch {
      setError("Could not load room options.");
      setProperty(null);
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  }, [search, slug]);

  useEffect(() => {
    void loadProperty();
  }, [loadProperty]);

  useEffect(() => {
    const parsed = parseSearchParams(searchParams);
    setSearch(
      resolvePropertySearchParams({
        city: parsed.city,
        dateRange: parsed.dateRange,
        guests: parsed.guests,
      }),
    );
  }, [searchParams]);

  useEffect(() => {
    if (isDesktop) {
      router.replace(buildPropertyUrl(slug, search));
    }
  }, [isDesktop, router, search, slug]);

  function handleSearchUpdate(nextSearch: PropertySearchParams) {
    setSearch(nextSearch);
    router.push(buildPropertyRoomsUrl(slug, nextSearch));
  }

  useEffect(() => {
    if (!selectedPlan || !search.dateRange.from || !search.dateRange.to) {
      setQuote(null);
      return;
    }

    const checkIn = formatDateParam(search.dateRange.from);
    const checkOut = formatDateParam(search.dateRange.to);
    if (!checkIn || !checkOut || checkIn >= checkOut) {
      setQuote(null);
      return;
    }

    let cancelled = false;
    async function loadQuote() {
      setQuoteLoading(true);
      try {
        const next = await fetchQuote({
          propertySlug: slug,
          roomTypeId: selectedPlan!.roomTypeId,
          ratePlanId: selectedPlan!.ratePlanId,
          checkIn,
          checkOut,
          rooms: search.guests.rooms,
          adults: search.guests.adults,
        });
        if (!cancelled) setQuote(next);
      } catch {
        if (!cancelled) setQuote(null);
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }

    void loadQuote();
    return () => {
      cancelled = true;
    };
  }, [search, selectedPlan, slug]);

  const displayPlan = useMemo(() => {
    if (!selectedPlan || !quote) return selectedPlan;
    const bill = quoteToBill(quote);
    return {
      ...selectedPlan,
      totalPrice: bill.roomPrice,
      estimatedTaxes: bill.tax,
      currency: bill.currency,
    };
  }, [quote, selectedPlan]);

  function handleReserve() {
    if (!selectedPlan || authLoading) return;

    if (!isAuthenticated) {
      router.push(buildCheckoutLoginUrl(slug, search, selectedPlan));
      return;
    }

    router.push(buildCheckoutUrl(slug, search, selectedPlan));
  }

  if (loading) {
    return <PropertyPageSkeleton />;
  }

  if (error || !property) {
    return (
      <Container className="py-16">
        <div className="rounded-md border bg-white p-10 text-center">
          <p className="text-muted-foreground">
            {error ?? "Property not found."}
          </p>
          <Button
            type="button"
            className="mt-4"
            onClick={() => router.push(buildPropertyUrl(slug, search))}
          >
            Back to property
          </Button>
        </div>
      </Container>
    );
  }

  const roomTypeCount = property.roomTypes.length;

  return (
    <div className="bg-white pb-28">
      <PropertyMobileStayHeader
        search={search}
        onSearchUpdate={handleSearchUpdate}
      />

      <div className="bg-neutral-900 px-4 py-2 text-center text-xs font-semibold text-brand lg:hidden">
        {roomTypeCount} Room Type{roomTypeCount === 1 ? "" : "s"} Available
      </div>

      <Container className="max-w-6xl space-y-4 py-5">
        {displayPlan ? (
          <PropertyPriceBreakup
            roomTotal={displayPlan.totalPrice}
            taxes={displayPlan.estimatedTaxes ?? 0}
            currency={displayPlan.currency}
          />
        ) : null}

        <PropertyRoomList
          roomTypes={property.roomTypes}
          currency={property.currency}
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />
      </Container>

      <PropertyRoomSelectionDock
        search={search}
        selectedPlan={displayPlan}
        currency={property.currency}
        quoteLoading={quoteLoading}
        quoteAvailable={quote?.available ?? true}
        onReserve={handleReserve}
      />
    </div>
  );
}
