"use client";

import { ArrowLeftIcon, HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PROPERTY_SECTIONS,
  type PropertySectionId,
} from "@/types/property-detail";

type PropertySectionNavProps = {
  activeId: PropertySectionId;
  onNavigate: (id: PropertySectionId) => void;
  propertyName?: string;
  onBack?: () => void;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  className?: string;
};

export function PropertySectionNav({
  activeId,
  onNavigate,
  propertyName,
  onBack,
  isFavourite = false,
  onToggleFavourite,
  className,
}: PropertySectionNavProps) {
  return (
    <nav
      aria-label="Property sections"
      className={cn(
        "sticky top-0 z-40 border-b bg-white/95 backdrop-blur-xl lg:top-14",
        className,
      )}
    >
      {propertyName ? (
        <div className="flex items-center gap-2 px-3 py-2 lg:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-full"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight">
            {propertyName}
          </h1>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-full"
            onClick={onToggleFavourite}
            aria-label={
              isFavourite ? "Remove from favourites" : "Add to favourites"
            }
            aria-pressed={isFavourite}
          >
            <HeartIcon
              className={cn(
                "size-5",
                isFavourite ? "fill-rose-500 text-rose-500" : "text-foreground",
              )}
            />
          </Button>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PROPERTY_SECTIONS.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onNavigate(section.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
