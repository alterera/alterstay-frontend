"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Container } from "@/components/common/container";
import { HeroSearchForm } from "@/components/sections/hero/hero-search-form";
import { MobileSearchEditSheet } from "@/components/search/mobile-search-edit-sheet";
import { MobileSearchHeader } from "@/components/search/mobile-search-header";
import { PropertyResultCard } from "@/components/search/property-result-card";
import { SearchFiltersSheet } from "@/components/search/search-filters-sheet";
import { useSearchPageLayout } from "@/components/search/search-page-layout-context";
import { SearchFiltersPanel } from "@/components/search/search-filters-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchSearchAreas,
  fetchSearchPropertyTypes,
  fetchSearchResults,
} from "@/lib/search-api";
import {
  buildSearchUrlFromState,
  parseSearchParams,
} from "@/lib/search-params";
import type { PropertySearchParams } from "@/types/search";
import {
  DEFAULT_SEARCH_FILTERS,
  type PropertySearchResult,
  type SearchArea,
  type SearchFilters,
  type SearchPropertyType,
} from "@/types/search-results";

type MobileSheet = "filters" | null;

/**
 * Scroll offsets that toggle the desktop morph. The header keeps a constant
 * flow height, so collapsing never shifts the document and the two thresholds
 * only exist to avoid toggling while the user hovers the boundary.
 */
const COLLAPSE_AFTER = 48;
const EXPAND_BEFORE = 16;

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setNavCollapsed, setIsSearchPage } = useSearchPageLayout();
  const desktopHeaderRef = useRef<HTMLDivElement | null>(null);
  const collapsedRef = useRef(false);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const [forceExpanded, setForceExpanded] = useState(false);
  const desktopExpanded = !scrolledPastHeader || forceExpanded;

  const initial = parseSearchParams(searchParams);
  const [search, setSearch] = useState<PropertySearchParams>(initial);
  const [filters, setFilters] = useState<SearchFilters>(initial.filters);
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(initial.filters);
  const [areas, setAreas] = useState<SearchArea[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<SearchPropertyType[]>([]);
  const [results, setResults] = useState<PropertySearchResult[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areaSearch, setAreaSearch] = useState("");
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>(null);
  const [mobileEditOpen, setMobileEditOpen] = useState(false);

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSearchResults(search, filters);
      setResults(response.results);
      setCount(response.count);
    } catch {
      setError("Could not load search results");
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    fetchSearchPropertyTypes().then(setPropertyTypes).catch(() => undefined);
  }, []);

  useEffect(() => {
    fetchSearchAreas(search.city, areaSearch || undefined)
      .then((response) => setAreas(response.areas))
      .catch(() => setAreas([]));
  }, [search.city, areaSearch]);

  useEffect(() => {
    void loadResults();
  }, [loadResults]);

  useEffect(() => {
    const parsed = parseSearchParams(searchParams);
    setSearch(parsed);
    setFilters(parsed.filters);
    setDraftFilters(parsed.filters);
  }, [searchParams]);

  const handleHeroSearch = useCallback(
    (nextSearch: PropertySearchParams) => {
      setForceExpanded(false);
      router.push(buildSearchUrlFromState(nextSearch, filters));
    },
    [filters, router],
  );

  useEffect(() => {
    setIsSearchPage(true);
    return () => {
      setIsSearchPage(false);
      setNavCollapsed(false);
    };
  }, [setIsSearchPage, setNavCollapsed]);

  useEffect(() => {
    setNavCollapsed(!desktopExpanded);
  }, [desktopExpanded, setNavCollapsed]);

  /**
   * Drive the morph from the scroll offset. The sticky header keeps a constant
   * height in the flow, so switching states cannot move the document and feed
   * back into this listener.
   */
  useEffect(() => {
    const sync = () => {
      const offset = window.scrollY;
      const next = collapsedRef.current
        ? offset > EXPAND_BEFORE
        : offset > COLLAPSE_AFTER;

      if (next === collapsedRef.current) return;

      collapsedRef.current = next;
      setScrolledPastHeader(next);
      if (!next) setForceExpanded(false);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  /** Re-collapse the expanded panel when the user dismisses it. */
  useEffect(() => {
    if (!forceExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setForceExpanded(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (desktopHeaderRef.current?.contains(target)) return;
      // Calendars and guest pickers render in portals outside the header.
      if (
        target.closest(
          '[data-slot="popover-content"],[data-slot="sheet-content"],[role="dialog"]',
        )
      ) {
        return;
      }
      setForceExpanded(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [forceExpanded]);

  function handleFiltersChange(nextFilters: SearchFilters) {
    setFilters(nextFilters);
    router.push(buildSearchUrlFromState(search, nextFilters));
  }

  function clearAllFilters() {
    handleFiltersChange(DEFAULT_SEARCH_FILTERS);
    setDraftFilters(DEFAULT_SEARCH_FILTERS);
  }

  const hasActiveFilters =
    filters.areaIds.length > 0 ||
    filters.priceBuckets.length > 0 ||
    filters.minRating !== null ||
    filters.propertyTypeIds.length > 0 ||
    filters.businessHotels ||
    filters.sortBy !== "recommended";

  return (
    <div className="bg-neutral-100 pb-6 lg:pb-10">
      {/* Desktop search bar. It is pinned right under the navbar and keeps a
          constant height in the flow, so the bar itself can shrink and travel
          up into the navbar without ever moving the page content. */}
      <div
        ref={desktopHeaderRef}
        className={cn(
          "sticky top-14 z-50 hidden h-32 border-b transition-[background-color,border-color,box-shadow] duration-500 ease-in-out lg:block",
          desktopExpanded
            ? "border-brand/20 bg-white"
            : "pointer-events-none border-transparent bg-transparent",
          forceExpanded && "shadow-lg shadow-black/5",
        )}
      >
        {/* Padding (not margin) so the offset cannot collapse out of the
            sticky wrapper and shift the pinned geometry. */}
        <Container className="pointer-events-none pt-6">
          <div
            className={cn(
              "pointer-events-auto relative mx-auto transition-all duration-500 ease-in-out",
              desktopExpanded
                ? "max-w-[64rem] translate-y-0"
                : "max-w-[36rem] -translate-y-18",
            )}
          >
            <HeroSearchForm
              morph
              compact={!desktopExpanded}
              dateLayout="combined"
              defaultValues={search}
              syncWithDefaults
              onSearch={handleHeroSearch}
            />

            {/* Collapsed, the whole bar is a single affordance that restores
                the full header. The search button stays clickable. */}
            {desktopExpanded ? null : (
              <button
                type="button"
                onClick={() => setForceExpanded(true)}
                aria-label="Edit search"
                className="absolute inset-y-0 right-10 left-0 z-10 cursor-pointer rounded-full"
              />
            )}
          </div>
        </Container>
      </div>

      {/* Mobile sticky header */}
      <div className="sticky top-0 z-40 lg:hidden">
        <MobileSearchHeader
          search={search}
          onEdit={() => setMobileEditOpen(true)}
          onFilter={() => {
            setDraftFilters(filters);
            setMobileSheet("filters");
          }}
          filterActive={hasActiveFilters}
        />
      </div>

      {/* Min height keeps enough runway for the collapse to trigger even when
          only a couple of results come back. */}
      <Container className="px-4 py-4 lg:py-6 lg:min-h-[calc(100vh-11.5rem)]">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl bg-white p-4 shadow-sm">
              <SearchFiltersPanel
                city={search.city}
                areas={areas}
                propertyTypes={propertyTypes}
                filters={filters}
                areaSearch={areaSearch}
                onAreaSearchChange={setAreaSearch}
                onChange={handleFiltersChange}
              />
            </div>
          </aside>

          <div className="space-y-3 lg:space-y-4">
            <h2 className="px-0.5 text-sm font-medium text-neutral-500 lg:text-lg lg:font-semibold lg:text-foreground">
              {count} {count === 1 ? "property" : "properties"} found
            </h2>

            {loading ? (
              <p className="text-sm text-muted-foreground">Searching properties…</p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : results.length === 0 ? (
              <div className="rounded-2xl border bg-white p-10 text-center">
                <p className="text-muted-foreground">
                  No properties matched your search. Try changing dates, city, or filters.
                </p>
              </div>
            ) : (
              results.map((property) => (
                <PropertyResultCard
                  key={property.id}
                  property={property}
                  search={search}
                />
              ))
            )}
          </div>
        </div>
      </Container>

      <MobileSearchEditSheet
        open={mobileEditOpen}
        onOpenChange={setMobileEditOpen}
        search={search}
        onSearch={handleHeroSearch}
      />

      <SearchFiltersSheet
        open={mobileSheet !== null}
        onOpenChange={(open) => !open && setMobileSheet(null)}
        city={search.city}
        areas={areas}
        propertyTypes={propertyTypes}
        filters={draftFilters}
        areaSearch={areaSearch}
        onAreaSearchChange={setAreaSearch}
        onChange={setDraftFilters}
        onClear={() => {
          clearAllFilters();
          setDraftFilters(DEFAULT_SEARCH_FILTERS);
        }}
        onApply={() => {
          handleFiltersChange(draftFilters);
          setMobileSheet(null);
        }}
        resultCount={count}
      />
    </div>
  );
}
