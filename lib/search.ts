import { formatDateParam } from "@/lib/search-params";
import type { PropertySearchParams } from "@/types/search";

export function buildSearchQueryParams(
  params: PropertySearchParams
): URLSearchParams {
  return new URLSearchParams({
    city: params.city,
    checkIn: params.dateRange.from
      ? formatDateParam(params.dateRange.from)
      : "",
    checkOut: params.dateRange.to ? formatDateParam(params.dateRange.to) : "",
    rooms: String(params.guests.rooms),
    adults: String(params.guests.adults),
    children: String(params.guests.children),
  });
}

export function buildSearchUrl(params: PropertySearchParams): string {
  const query = buildSearchQueryParams(params).toString();
  return query ? `/search?${query}` : "/search";
}
