"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { PropertyBookingPanel } from "@/components/property/property-booking-panel";
import { PropertyBreadcrumb } from "@/components/property/property-breadcrumb";
import { PropertyFacilitiesSection } from "@/components/property/property-facilities-section";
import { PropertyImageGrid } from "@/components/property/property-image-grid";
import { PropertyInfoSection } from "@/components/property/property-info-section";
import { PropertyLocationSection } from "@/components/property/property-location-section";
import { PropertyMobileBookingDock } from "@/components/property/property-mobile-booking-dock";
import { PropertyMobileStayHeader } from "@/components/property/property-mobile-stay-header";
import { PropertyPoliciesSection } from "@/components/property/property-policies-section";
import { PropertyRatingsSection } from "@/components/property/property-ratings-section";
import { PropertyRoomOptionsSection } from "@/components/property/property-room-options-section";
import { PropertySectionNav } from "@/components/property/property-section-nav";
import { PropertyPageSkeleton } from "@/components/skeletons";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useFavouriteProperty } from "@/hooks/use-favourite-property";
import { usePropertySearchDefaults } from "@/hooks/use-property-search-defaults";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import {
  buildCheckoutLoginUrl,
  buildCheckoutUrl,
} from "@/lib/booking-url";
import { fetchQuote } from "@/lib/quote-api";
import { quoteToBill } from "@/lib/quote-utils";
import { fetchPropertyDetail } from "@/lib/property-api";
import { findLowestPricePlan, planToSelection } from "@/lib/property-booking";
import { FeaturedPropertiesSection } from "@/components/sections/featured-properties";
import { splitAmenities } from "@/lib/property-enrichment";
import { buildPropertyRoomsUrl, buildPropertyUrl } from "@/lib/property-url";
import {
  parseSearchParams,
  formatDateParam,
  resolvePropertySearchParams,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";
import {
  PROPERTY_SECTIONS,
  type PropertyDetail,
  type PropertySectionId,
  type SelectedRoomPlan,
} from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";
import type { QuoteResponse } from "@/types/quote";

type PropertyPageProps = {
  slug: string;
};

function toResolvedSearch(params: URLSearchParams): PropertySearchParams {
  const parsed = parseSearchParams(params);
  return resolvePropertySearchParams({
    city: parsed.city,
    dateRange: parsed.dateRange,
    guests: parsed.guests,
  });
}

export function PropertyPage({ slug }: PropertyPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isDesktop = useIsDesktop();

  const [search, setSearch] = useState<PropertySearchParams>(() =>
    toResolvedSearch(searchParams),
  );
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedRoomPlan | null>(
    null,
  );
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  usePropertySearchDefaults({ slug, buildUrl: buildPropertyUrl });

  const { isFavourite, toggleFavourite } = useFavouriteProperty(slug);
  const sectionIds = PROPERTY_SECTIONS.map((section) => section.id);
  const { activeId, scrollToSection } = useScrollSpy(sectionIds);

  const loadProperty = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertyDetail(slug, search);
      setProperty(data);
      setSelectedPlan((current) => {
        if (current) {
          for (const roomType of data.roomTypes) {
            const preserved = planToSelection(roomType, current.ratePlanId);
            if (preserved) return preserved;
          }
        }
        return findLowestPricePlan(data);
      });
    } catch {
      setError("Could not load this property.");
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
    setSearch(toResolvedSearch(searchParams));
  }, [searchParams]);

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

  function handleSearchUpdate(nextSearch: PropertySearchParams) {
    setSearch(nextSearch);
    router.push(buildPropertyUrl(slug, nextSearch));
  }

  function handleSectionNavigate(id: PropertySectionId) {
    if (id === "room-options" && isDesktop === false) {
      router.push(buildPropertyRoomsUrl(slug, search));
      return;
    }
    scrollToSection(id);
  }

  function handleSelectRoom() {
    router.push(buildPropertyRoomsUrl(slug, search));
  }

  function handleBookNow() {
    if (!selectedPlan || authLoading) return;

    if (!isAuthenticated && isDesktop === false) {
      router.push(buildCheckoutLoginUrl(slug, search, selectedPlan));
      return;
    }

    router.push(buildCheckoutUrl(slug, search, selectedPlan));
  }

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

  if (error || (!loading && !property)) {
    return (
      <div className="bg-white pb-24 lg:pb-12">
        <PropertyMobileStayHeader
          search={search}
          onSearchUpdate={handleSearchUpdate}
        />
        <Container className="py-16">
          <div className="rounded-md border bg-white p-10 text-center">
            <p className="text-muted-foreground">
              {error ?? "Property not found."}
            </p>
          </div>
        </Container>
      </div>
    );
  }

  if (loading || !property) {
    return (
      <div className="bg-white">
        <PropertyMobileStayHeader
          search={search}
          onSearchUpdate={handleSearchUpdate}
        />
        <PropertyPageSkeleton />
      </div>
    );
  }

  const { perks, amenities } = splitAmenities(property);

  return (
    <div className="bg-white pb-24 lg:pb-12">
      <PropertyMobileStayHeader
        search={search}
        onSearchUpdate={handleSearchUpdate}
      />

      <Container className="space-y-6 py-6">
        <div className="hidden lg:block">
          <PropertyBreadcrumb city={property.city} propertyName={property.name} />
        </div>
        <div className="relative">
          <div className="absolute right-3 top-3 z-20 lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-md bg-white/95 backdrop-blur"
              onClick={toggleFavourite}
              aria-label={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
              aria-pressed={isFavourite}
            >
              <HeartIcon
                className={cn(
                  "size-4",
                  isFavourite ? "fill-rose-500 text-rose-500" : "text-foreground",
                )}
              />
            </Button>
          </div>
          <PropertyImageGrid name={property.name} imageUrls={property.imageUrls} />
        </div>
      </Container>

      <PropertySectionNav
        activeId={activeId as PropertySectionId}
        onNavigate={handleSectionNavigate}
      />

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="space-y-16">
            <PropertyInfoSection property={property} />

            <PropertyFacilitiesSection perks={perks} amenities={amenities} />

            <PropertyLocationSection property={property} />

            <PropertyRatingsSection
              reviewSummary={property.reviewSummary}
              reviews={property.reviews}
            />

            <PropertyPoliciesSection
              policies={property.policies}
              checkInTime={property.checkInTime}
              checkOutTime={property.checkOutTime}
            />

            <PropertyRoomOptionsSection
              property={property}
              search={search}
              selectedPlan={selectedPlan}
              onSearchUpdate={handleSearchUpdate}
              onSelectPlan={setSelectedPlan}
            />
          </div>

          <PropertyBookingPanel
            search={search}
            selectedPlan={displayPlan}
            currency={property.currency}
            quoteLoading={quoteLoading}
            quoteAvailable={quote?.available ?? true}
            onSearchUpdate={handleSearchUpdate}
            onChooseRoom={() => scrollToSection("room-options")}
            onBookNow={handleBookNow}
          />
        </div>
      </Container>

      <PropertyMobileBookingDock
        property={property}
        onSelectRoom={handleSelectRoom}
      />

      {property.city ? (
        <FeaturedPropertiesSection
          city={property.city}
          excludeSlug={property.slug}
          title={`More stays in ${property.city}`}
          subtitle="Other hotels travellers are booking in this city"
        />
      ) : null}
    </div>
  );
}
