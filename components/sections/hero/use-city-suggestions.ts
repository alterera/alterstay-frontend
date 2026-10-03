"use client";

import { useEffect, useState } from "react";

import { fetchCitySuggestions } from "@/lib/cities-api";
import type { CitySuggestion } from "@/types/cities";

const SEARCH_DEBOUNCE_MS = 250;
const SUGGESTION_LIMIT = 15;

export function useCitySuggestions(query: string) {
  const [cities, setCities] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const term = query.trim();

    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(false);

      fetchCitySuggestions(term || undefined, SUGGESTION_LIMIT)
        .then((data) => {
          if (!cancelled) {
            setCities(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setCities([]);
            setError(true);
            setLoading(false);
          }
        });
    }, term ? SEARCH_DEBOUNCE_MS : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return { cities, loading, error };
}
