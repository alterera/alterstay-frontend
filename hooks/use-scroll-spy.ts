"use client";

import { useEffect, useState } from "react";

function isSpyTargetVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

export function useScrollSpy(
  sectionIds: readonly string[],
  options?: { rootMargin?: string; threshold?: number },
) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(
        (node): node is HTMLElement =>
          node !== null && isSpyTargetVisible(node),
      );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible.length === 0) return;

        const belowHeader =
          visible.find((entry) => entry.boundingClientRect.top >= 0) ??
          visible[visible.length - 1];

        if (belowHeader.target.id) {
          setActiveId(belowHeader.target.id);
        }
      },
      {
        rootMargin: options?.rootMargin ?? "-40% 0px -45% 0px",
        threshold: options?.threshold ?? [0, 0.1, 0.25, 0.5],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [options?.rootMargin, options?.threshold, sectionIds]);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (!element || !isSpyTargetVisible(element)) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return { activeId, scrollToSection };
}
