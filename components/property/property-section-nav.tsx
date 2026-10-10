"use client";

import { useEffect, useMemo, useRef } from "react";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import {
  PROPERTY_SECTIONS,
  type PropertySectionId,
} from "@/types/property-detail";

type PropertySectionNavProps = {
  activeId: PropertySectionId;
  onNavigate: (id: PropertySectionId) => void;
  className?: string;
  /** Overrides mobile sticky `top` (below compact stay header). */
  mobileStickyTopClassName?: string;
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
  className,
  mobileStickyTopClassName,
}: PropertySectionNavProps) {
  const isDesktop = useIsDesktop();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const sections = useMemo(
    () =>
      isDesktop === false
        ? PROPERTY_SECTIONS.filter((section) => section.id !== "room-options")
        : PROPERTY_SECTIONS,
    [isDesktop],
  );

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
        "sticky z-40 border-b bg-white",
        mobileStickyTopClassName ??
          "top-[calc(2.75rem+env(safe-area-inset-top,0px))]",
        "lg:top-0",
        className,
      )}
    >
      <div
        ref={scrollerRef}
        className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section) => {
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

