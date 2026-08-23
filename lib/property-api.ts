import { getApiBase } from "@/lib/auth-api";
import type { PropertySearchParams } from "@/types/search";
import type { PropertyDetail } from "@/types/property-detail";
import { buildPropertyQueryString } from "@/lib/property-url";

async function publicFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`);
  if (response.status === 404) {
    throw new Error("Property not found");
  }
  if (!response.ok) {
    throw new Error("Property request failed");
  }
  return response.json() as Promise<T>;
}

export function fetchPropertyDetail(
  slug: string,
  search: PropertySearchParams,
) {
  const query = buildPropertyQueryString(search);
  return publicFetch<PropertyDetail>(
    `/search/properties/${encodeURIComponent(slug)}?${query}`,
  );
}
