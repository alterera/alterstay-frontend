"use client";

import { useEffect, useRef } from "react";
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

function scrollTabIntoView(
  scroller: HTMLElement,
  tab: HTMLElement,
  behavior: ScrollBehavior,
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const edgePadding = 16;
  const overflowLeft = scrollerRect.left + edgePadding - tabRect.left;
  const overflowRight = tabRect.right - (scrollerRect.right - edgePadding);

  if (overflowLeft <= 0 && overflowRight <= 0) return;

  scroller.scrollBy({
    left: overflowLeft > 0 ? -overflowLeft : overflowRight,
    behavior,
  });
}

export function PropertySectionNav({
  activeId,
  onNavigate,
  propertyName,
  onBack,
  isFavourite = false,
  onToggleFavourite,
  className,
}: PropertySectionNavProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    const scroller = scrollerRef.current;
    const tab = tabRefs.current.get(activeId);
    if (!scroller || !tab) return;
    scrollTabIntoView(scroller, tab, "smooth");
  }, [activeId]);

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

      <div
        ref={scrollerRef}
        className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PROPERTY_SECTIONS.map((section) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              ref={(node) => {
                if (node) tabRefs.current.set(section.id, node);
                else tabRefs.current.delete(section.id);
              }}
              type="button"
              onClick={() => {
                const scroller = scrollerRef.current;
                const tab = tabRefs.current.get(section.id);
                if (scroller && tab) scrollTabIntoView(scroller, tab, "smooth");
                onNavigate(section.id);
              }}
              className={cn(
                "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand text-brand"
                  : "border-transparent text-muted-foreground hover:text-foreground",
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
