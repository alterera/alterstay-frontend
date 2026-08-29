"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 8;

/**
 * Hides the navbar while scrolling down; reveals it when the user scrolls up.
 */
export function useNavbarScrollHidden(threshold = DEFAULT_THRESHOLD) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function onScroll() {
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY <= 0) {
          setHidden(false);
        } else if (currentY > lastScrollY.current + threshold) {
          setHidden(true);
        } else if (currentY < lastScrollY.current - threshold) {
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return hidden;
}
