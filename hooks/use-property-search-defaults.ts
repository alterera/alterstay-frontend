"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  parseSearchParams,
  propertySearchNeedsDefaults,
  resolvePropertySearchParams,
} from "@/lib/search-params";
import type { PropertySearchParams } from "@/types/search";

type UsePropertySearchDefaultsOptions = {
  slug: string;
  buildUrl: (slug: string, search: PropertySearchParams) => string;
};

export function usePropertySearchDefaults({
  slug,
  buildUrl,
}: UsePropertySearchDefaultsOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!propertySearchNeedsDefaults(searchParams)) return;

    const parsed = parseSearchParams(searchParams);
    const resolved = resolvePropertySearchParams({
      city: parsed.city,
      dateRange: parsed.dateRange,
      guests: parsed.guests,
    });

    router.replace(buildUrl(slug, resolved));
  }, [buildUrl, router, searchParams, slug]);
}
