"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type PropertyGalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  images: string[];
  initialIndex?: number;
};

export function PropertyGalleryDialog({
  open,
  onOpenChange,
  name,
  images,
  initialIndex = 0,
}: PropertyGalleryDialogProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (!api || !open) return;
    api.scrollTo(initialIndex, true);
    setActiveIndex(initialIndex);
  }, [api, initialIndex, open]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[min(96vw,72rem)] max-w-none gap-4 overflow-hidden p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_120px]">
          <Carousel setApi={setApi} className="min-w-0">
            <CarouselContent>
              {images.map((url, index) => (
                <CarouselItem key={`${url}-${index}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${name} photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex max-h-[420px] flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden">
            {images.map((url, index) => (
              <button
                key={`thumb-${url}-${index}`}
                type="button"
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                  index === activeIndex
                    ? "border-brand"
                    : "border-transparent opacity-80 hover:opacity-100",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="aspect-[4/3] w-24 object-cover lg:w-full"
                />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
