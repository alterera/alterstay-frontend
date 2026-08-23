import { format } from "date-fns";

import type { PropertySearchParams } from "@/types/search";
import type { SearchFilters } from "@/types/search-results";

export function formatDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateParam(value: string | null): Date | undefined {
  if (!value) return undefined;
  const iso = value.includes("T") ? value.slice(0, 10) : value;
  const parsed = new Date(`${iso}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function parseSearchParams(
  params: URLSearchParams,
): PropertySearchParams & { filters: SearchFilters } {
  const from = parseDateParam(params.get("checkIn"));
  const to = parseDateParam(params.get("checkOut"));

  return {
    city: params.get("city") ?? "Mumbai",
    dateRange: { from, to },
    guests: {
      rooms: Number(params.get("rooms") ?? "1") || 1,
      adults: Number(params.get("adults") ?? "2") || 2,
      children: 0,
    },
    filters: {
      areaIds: params.get("areas")?.split(",").filter(Boolean) ?? [],
      priceBuckets: params.get("priceBuckets")?.split(",").filter(Boolean) ?? [],
      minRating: params.get("minRating")
        ? Number(params.get("minRating"))
        : null,
      propertyTypeIds:
        params.get("propertyTypes")?.split(",").filter(Boolean) ?? [],
      businessHotels: params.get("businessHotels") === "true",
      sortBy:
        (params.get("sortBy") as SearchFilters["sortBy"]) ?? "recommended",
    },
  };
}

export function buildSearchQueryString(
  search: PropertySearchParams,
  filters: SearchFilters,
): string {
  const query = new URLSearchParams({
    city: search.city,
    checkIn: search.dateRange.from
      ? formatDateParam(search.dateRange.from)
      : "",
    checkOut: search.dateRange.to ? formatDateParam(search.dateRange.to) : "",
    rooms: String(search.guests.rooms),
    adults: String(search.guests.adults),
    children: String(search.guests.children),
  });

  if (filters.areaIds.length) query.set("areas", filters.areaIds.join(","));
  if (filters.priceBuckets.length) {
    query.set("priceBuckets", filters.priceBuckets.join(","));
  }
  if (filters.minRating) query.set("minRating", String(filters.minRating));
  if (filters.propertyTypeIds.length) {
    query.set("propertyTypes", filters.propertyTypeIds.join(","));
  }
  if (filters.businessHotels) query.set("businessHotels", "true");
  if (filters.sortBy && filters.sortBy !== "recommended") {
    query.set("sortBy", filters.sortBy);
  }

  return query.toString();
}

export function buildSearchUrlFromState(
  search: PropertySearchParams,
  filters: SearchFilters,
): string {
  const query = buildSearchQueryString(search, filters);
  return query ? `/search?${query}` : "/search";
}
