"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "alterstays:favourite-slugs";

function readSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export function useFavouriteProperty(slug: string) {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    setIsFavourite(readSlugs().includes(slug));
  }, [slug]);

  const toggleFavourite = useCallback(() => {
    const next = new Set(readSlugs());
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    const slugs = Array.from(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    setIsFavourite(next.has(slug));
  }, [slug]);

  return { isFavourite, toggleFavourite };
}
