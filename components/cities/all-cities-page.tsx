"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/common/container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ROUTES } from "@/constants/routes";
import {
  ALPHABET,
  buildCitySearchUrl,
  fetchCities,
  groupCitiesByLetter,
} from "@/lib/cities-api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CityListItem } from "@/types/cities";

function CityDirectoryCard({ city }: { city: CityListItem }) {
  const staysLabel =
    city.propertyCount === 1 ? "1 Stay" : `${city.propertyCount} Stays`;

  return (
    <Link
      href={buildCitySearchUrl(city.name)}
      className="block rounded-xl border border-border bg-surface p-4 shadow-sm transition-colors hover:border-brand/30 hover:bg-brand/5"
    >
      <h3 className="text-base font-semibold text-foreground">{city.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{staysLabel}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {city.minPriceFrom != null ? (
          <>
            Prices start from{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(city.minPriceFrom, city.currency)}
            </span>
          </>
        ) : (
          "Prices start from —"
        )}
      </p>
    </Link>
  );
}

function cityStartsWithLetter(city: CityListItem, letter: string) {
  return city.name.trim().charAt(0).toUpperCase() === letter;
}

export function AllCitiesPage() {
  const [cities, setCities] = useState<CityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const grouped = useMemo(() => groupCitiesByLetter(cities), [cities]);

  const availableLetters = useMemo(
    () =>
      ALPHABET.filter((letter) => (grouped.get(letter)?.length ?? 0) > 0),
    [grouped],
  );

  const filteredCities = useMemo(() => {
    if (!activeLetter) return cities;
    return cities.filter((city) => cityStartsWithLetter(city, activeLetter));
  }, [activeLetter, cities]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCities();
        if (!cancelled) setCities(data);
      } catch {
        if (!cancelled) {
          setError("Could not load cities. Please try again later.");
          setCities([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLetterClick(letter: string) {
    setActiveLetter((current) => (current === letter ? null : letter));
  }

  return (
    <section className="bg-background pb-12 pt-6 lg:pt-10">
      <Container className="max-w-6xl">
        <Breadcrumb>
          <BreadcrumbList className="text-xs sm:text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={ROUTES.home} />}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>All Cities</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          All Cities
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Browse destinations across India and find your next stay.
        </p>

        <div className="mt-6 border-b border-border py-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setActiveLetter(null)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeLetter === null
                  ? "bg-brand text-brand-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              All
            </button>
            {ALPHABET.map((letter) => {
              const enabled = availableLetters.includes(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!enabled || loading}
                  onClick={() => handleLetterClick(letter)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors sm:size-9",
                    enabled
                      ? isActive
                        ? "bg-brand text-brand-foreground"
                        : "text-foreground hover:bg-muted"
                      : "cursor-not-allowed text-muted-foreground/40",
                  )}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="mt-8 text-sm text-destructive">{error}</p>
        ) : null}

        {!loading && !error ? (
          <div className="mt-8">
            {activeLetter ? (
              <>
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Cities starting with {activeLetter}
                </h2>
                {filteredCities.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCities.map((city) => (
                      <CityDirectoryCard key={city.slug} city={city} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No cities found for this letter.
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-10">
                {ALPHABET.map((letter) => {
                  const items = grouped.get(letter) ?? [];
                  if (!items.length) return null;

                  return (
                    <section key={letter}>
                      <h2 className="mb-4 text-lg font-semibold text-foreground">
                        {letter}
                      </h2>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((city) => (
                          <CityDirectoryCard key={city.slug} city={city} />
                        ))}
                      </div>
                    </section>
                  );
                })}

                {cities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No cities available yet.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
