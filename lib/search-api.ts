import { getApiBase } from "@/lib/auth-api";
import type {
  SearchArea,
  SearchFilters,
  SearchPropertiesResponse,
  SearchPropertyType,
} from "@/types/search-results";
import type { PropertySearchParams } from "@/types/search";
import { buildSearchQueryString } from "@/lib/search-params";

async function publicFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`);
  if (!response.ok) {
    throw new Error("Search request failed");
  }
  return response.json() as Promise<T>;
}

export function fetchSearchAreas(city: string, q?: string) {
  const params = new URLSearchParams({ city });
  if (q) params.set("q", q);
  return publicFetch<{ city: string; areas: SearchArea[] }>(
    `/search/areas?${params.toString()}`,
  );
}

export function fetchSearchPropertyTypes() {
  return publicFetch<SearchPropertyType[]>("/search/property-types");
}

export function fetchSearchResults(
  search: PropertySearchParams,
  filters: SearchFilters,
) {
  const query = buildSearchQueryString(search, filters);
  return publicFetch<SearchPropertiesResponse>(`/search/properties?${query}`);
}
