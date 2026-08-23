"use client";

import { useState } from "react";
import { ImagesIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { PropertyGalleryDialog } from "./property-gallery-dialog";

type PropertyImageGridProps = {
  name: string;
  imageUrls: string[];
  className?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200";

export function PropertyImageGrid({
  name,
  imageUrls,
  className,
}: PropertyImageGridProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const images = imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE];
  const visible = images.slice(0, 5);
  const remaining = Math.max(0, images.length - 5);

  function openGallery(index: number) {
    setInitialIndex(index);
    setGalleryOpen(true);
  }

  return (
    <>
      <div
        className={cn(
          "grid h-[220px] grid-cols-4 grid-rows-2 gap-2 sm:h-[280px] md:h-[340px] lg:h-[420px] lg:gap-3",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => openGallery(0)}
          className="relative col-span-2 row-span-2 overflow-hidden rounded-xl bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visible[0]}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </button>

        {visible.slice(1).map((url, index) => {
          const imageIndex = index + 1;
          const isLast = imageIndex === visible.length - 1 && remaining > 0;

          return (
            <button
              key={`${url}-${imageIndex}`}
              type="button"
              onClick={() => openGallery(imageIndex)}
              className="relative overflow-hidden rounded-xl bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
              {isLast ? (
                <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/45 text-sm font-semibold text-white">
                  <ImagesIcon className="size-4" />+{remaining} Photos
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <PropertyGalleryDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        name={name}
        images={images}
        initialIndex={initialIndex}
      />
    </>
  );
}
