"use client";

import { citiesConfig } from "@/config/cities";
import { Container } from "@/components/common/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { AllCitiesCard, CityCard } from "./city-card";

type CitiesSectionProps = {
  className?: string;
};

export function CitiesSection({ className }: CitiesSectionProps) {
  const { title, items, allCities } = citiesConfig;

  return (
    <section className={cn("bg-background py-6 sm:py-8 lg:py-10", className)}>
      <Container>
        <h2 className="mb-6 text-center text-lg font-semibold tracking-tight text-foreground sm:mb-8 sm:text-xl">
          {title}
        </h2>
      </Container>

      {/* Mobile / tablet: full-bleed carousel */}
      <div className="lg:hidden">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2.5 pl-4 sm:-ml-3.5 sm:pl-6">
            {items.map((city) => (
              <CarouselItem
                key={city.id}
                className="basis-auto pl-2.5 sm:pl-3.5"
              >
                <CityCard city={city} />
              </CarouselItem>
            ))}
            <CarouselItem className="basis-auto pl-2.5 pr-4 sm:pl-3.5 sm:pr-6">
              <AllCitiesCard name={allCities.name} href={allCities.href} />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop: static centered row */}
      <Container className="hidden lg:block">
        <div className="flex flex-wrap items-start justify-center gap-5 xl:gap-6">
          {items.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
          <AllCitiesCard name={allCities.name} href={allCities.href} />
        </div>
      </Container>
    </section>
  );
}
