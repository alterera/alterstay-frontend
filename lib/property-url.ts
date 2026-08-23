import type { PropertySearchParams } from "@/types/search";
import { formatDateParam } from "@/lib/search-params";

export function buildPropertyQueryString(
  search: PropertySearchParams,
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
  return query.toString();
}

export function buildPropertyUrl(
  slug: string,
  search: PropertySearchParams,
): string {
  const query = buildPropertyQueryString(search);
  return `/properties/${slug}?${query}`;
}
