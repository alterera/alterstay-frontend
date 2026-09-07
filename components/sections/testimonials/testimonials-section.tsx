"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { testimonialsConfig } from "@/config/testimonials";
import { cn } from "@/lib/utils";

import { TestimonialCard } from "./testimonial-card";

type TestimonialsSectionProps = {
  className?: string;
};

function TestimonialControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous testimonials"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-[#1e2a5a]/15 bg-white text-[#1e2a5a] shadow-sm transition-colors",
          "hover:bg-[#1e2a5a]/5 disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <ChevronLeftIcon className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next testimonials"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-[#1e2a5a]/15 bg-white text-[#1e2a5a] shadow-sm transition-colors",
          "hover:bg-[#1e2a5a]/5 disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        <ChevronRightIcon className="size-5" />
      </button>
    </div>
  );
}

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const { title, items } = testimonialsConfig;

  return (
    <section
      className={cn(
        "w-full bg-[#edf0fb] py-8 sm:py-14 lg:py-10",
        className,
      )}
    >
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#1e2a5a] sm:text-3xl">
              {title}
            </h2>
            <TestimonialControls />
          </div>
        </Container>

        <Container className="px-0 sm:px-0 lg:px-8">
          <CarouselContent className="-ml-3 pl-4 sm:-ml-4 sm:pl-6 lg:pl-0">
            {items.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-[85%] pl-3 sm:basis-[55%] sm:pl-4 md:basis-[42%] lg:basis-[33.333%]"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
            <CarouselItem className="basis-4 pl-0 sm:basis-6 lg:basis-0" />
          </CarouselContent>
        </Container>
      </Carousel>
    </section>
  );
}
