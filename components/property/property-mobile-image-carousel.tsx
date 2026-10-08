"use client";

import { useCallback, useState } from "react";
import { ImagesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { PropertyGalleryDialog } from "./property-gallery-dialog";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200";

type PropertyMobileImageCarouselProps = {
  name: string;
  imageUrls: string[];
  className?: string;
};

export function PropertyMobileImageCarousel({
  name,
  imageUrls,
  className,
}: PropertyMobileImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const images = (imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE]).slice(
    0,
    5,
  );

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const width = el.clientWidth;
      if (width <= 0) return;
      const index = Math.round(el.scrollLeft / width);
      setActiveIndex(Math.min(Math.max(index, 0), images.length - 1));
    },
    [images.length],
  );

  return (
    <>
      <div
        className={cn(
          "relative w-full lg:hidden",
          "h-[min(calc(100svh-7.5rem-env(safe-area-inset-top,0px)),420px)] min-h-[220px]",
          className,
        )}
      >
        <div
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={onScroll}
        >
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              className="relative h-full w-full shrink-0 snap-center"
              onClick={() => {
                setActiveIndex(index);
                setGalleryOpen(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={index === 0 ? name : ""}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute bottom-3 right-3 h-8 gap-1.5 rounded-md bg-white/95 px-2.5 text-xs font-semibold text-foreground shadow-md backdrop-blur"
          onClick={() => setGalleryOpen(true)}
        >
          <ImagesIcon className="size-3.5" />
          View All
        </Button>

        {images.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "size-1.5 rounded-full bg-white/50",
                  index === activeIndex && "bg-white",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      <PropertyGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        name={name}
        images={imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE]}
        initialIndex={activeIndex}
      />
    </>
  );
}
