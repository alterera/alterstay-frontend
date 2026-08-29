import { getApiBase } from "@/lib/auth-api";
import type { CityListItem } from "@/types/cities";

export function fetchCities() {
  return fetch(`${getApiBase()}/search/cities`).then(async (response) => {
    if (!response.ok) {
      throw new Error("Failed to load cities");
    }
    return response.json() as Promise<CityListItem[]>;
  });
}

export function buildCitySearchUrl(cityName: string) {
  return `/search?city=${encodeURIComponent(cityName)}`;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function groupCitiesByLetter(cities: CityListItem[]) {
  const grouped = new Map<string, CityListItem[]>();

  for (const letter of ALPHABET) {
    grouped.set(letter, []);
  }

  for (const city of cities) {
    const first = city.name.trim().charAt(0).toUpperCase();
    const letter = ALPHABET.includes(first) ? first : "#";
    const bucket = grouped.get(letter) ?? [];
    bucket.push(city);
    grouped.set(letter, bucket);
  }

  for (const [letter, items] of grouped) {
    items.sort((a, b) => a.name.localeCompare(b.name));
    grouped.set(letter, items);
  }

  return grouped;
}

export { ALPHABET };
