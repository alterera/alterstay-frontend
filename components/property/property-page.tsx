"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { PropertyBookingPanel } from "@/components/property/property-booking-panel";
import { PropertyBreadcrumb } from "@/components/property/property-breadcrumb";
import { PropertyFacilitiesSection } from "@/components/property/property-facilities-section";
import { PropertyImageGrid } from "@/components/property/property-image-grid";
import { PropertyInfoSection } from "@/components/property/property-info-section";
import { PropertyLocationSection } from "@/components/property/property-location-section";
import { PropertyMobileBookingDock } from "@/components/property/property-mobile-booking-dock";
import { PropertyPoliciesSection } from "@/components/property/property-policies-section";
import { PropertyRatingsSection } from "@/components/property/property-ratings-section";
import { PropertyRoomOptionsSection } from "@/components/property/property-room-options-section";
import { PropertySectionNav } from "@/components/property/property-section-nav";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useFavouriteProperty } from "@/hooks/use-favourite-property";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import {
  buildBookingLoginUrl,
  buildBookingSummaryUrl,
} from "@/lib/booking-url";
import { fetchPropertyDetail } from "@/lib/property-api";
import { findLowestPricePlan, planToSelection } from "@/lib/property-booking";
import {
  buildRatingBreakdown,
  getPropertyRestrictions,
  splitAmenities,
} from "@/lib/property-enrichment";
import { buildPropertyUrl } from "@/lib/property-url";
import { parseSearchParams } from "@/lib/search-params";
import {
  PROPERTY_SECTIONS,
  type PropertyDetail,
  type PropertySectionId,
  type SelectedRoomPlan,
} from "@/types/property-detail";
import type { PropertySearchParams } from "@/types/search";

type PropertyPageProps = {
  slug: string;
};

export function PropertyPage({ slug }: PropertyPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isDesktop = useIsDesktop();
  const initialSearch = parseSearchParams(searchParams);

  const [search, setSearch] = useState<PropertySearchParams>(initialSearch);
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SelectedRoomPlan | null>(
    null,
  );

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
    const parsed = parseSearchParams(searchParams);
    setSearch(parsed);
  }, [searchParams]);

  function handleSearchUpdate(nextSearch: PropertySearchParams) {
    setSearch(nextSearch);
    router.push(buildPropertyUrl(slug, nextSearch));
  }

  function handleBookNow() {
    if (!selectedPlan || authLoading) return;

    if (!isAuthenticated && isDesktop === false) {
      router.push(buildBookingLoginUrl(slug, search, selectedPlan));
      return;
    }

    router.push(buildBookingSummaryUrl(slug, search, selectedPlan));
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading property…
      </div>
    );
  }

  if (error || !property) {
    return (
      <Container className="py-16">
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-muted-foreground">
            {error ?? "Property not found."}
          </p>
        </div>
      </Container>
    );
  }

  const { perks, amenities } = splitAmenities(property);
  const ratingBreakdown = buildRatingBreakdown(property.guestRating);
  const restrictions = getPropertyRestrictions();

  return (
    <div className="bg-muted/20 pb-24 lg:pb-12">
      <Container className="space-y-6 py-6">
        <div className="hidden lg:block">
          <PropertyBreadcrumb city={property.city} propertyName={property.name} />
        </div>
        <PropertyImageGrid name={property.name} imageUrls={property.imageUrls} />
      </Container>

      <PropertySectionNav
        activeId={activeId as PropertySectionId}
        onNavigate={scrollToSection}
        propertyName={property.name}
        onBack={() => router.back()}
        isFavourite={isFavourite}
        onToggleFavourite={toggleFavourite}
      />

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="space-y-16">
            <PropertyInfoSection property={property} />

            <PropertyFacilitiesSection perks={perks} amenities={amenities} />

            <PropertyLocationSection property={property} />

            <PropertyRatingsSection
              guestRating={property.guestRating}
              breakdown={ratingBreakdown}
            />

            <PropertyPoliciesSection
              policies={property.policies}
              restrictions={restrictions}
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
            selectedPlan={selectedPlan}
            currency={property.currency}
            onSearchUpdate={handleSearchUpdate}
            onChooseRoom={() => scrollToSection("room-options")}
            onBookNow={handleBookNow}
          />
        </div>
      </Container>

      <PropertyMobileBookingDock
        search={search}
        selectedPlan={selectedPlan}
        currency={property.currency}
        onBookNow={handleBookNow}
      />
    </div>
  );
}
