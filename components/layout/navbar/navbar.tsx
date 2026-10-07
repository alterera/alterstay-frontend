"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { useNavbarScrollHidden } from "@/hooks/use-navbar-scroll-hidden";
import { useOptionalSearchPageLayout } from "@/components/search/search-page-layout-context";
import { cn } from "@/lib/utils";

import { NavbarDesktopNav, NavbarLoginButton } from "./navbar-desktop-nav";

type NavbarProps = {
  className?: string;
};

const HOME_HERO_SCROLL_THRESHOLD = 48;

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const layout = useOptionalSearchPageLayout();
  const isSearchPage = layout?.isSearchPage ?? false;
  const scrollHidden = useNavbarScrollHidden();
  const [homeHeroNav, setHomeHeroNav] = useState(isHomePage);

  useEffect(() => {
    if (!isHomePage) {
      setHomeHeroNav(false);
      return;
    }

    function syncHeroNav() {
      setHomeHeroNav(window.scrollY < HOME_HERO_SCROLL_THRESHOLD);
    }

    syncHeroNav();
    window.addEventListener("scroll", syncHeroNav, { passive: true });
    return () => window.removeEventListener("scroll", syncHeroNav);
  }, [isHomePage]);

  const navVariant = isHomePage && homeHeroNav ? "hero" : "default";
  /** The search bar morphs into this row, so the links step aside for it. */
  const linksHidden = isSearchPage && Boolean(layout?.navCollapsed);
  /**
   * On the search page the bar stays pinned so the compact search can sit in
   * the nav-links slot. Elsewhere, hide the whole header while scrolling down.
   */
  const hideBar = !isSearchPage && scrollHidden;

  return (
    <header
      className={cn(
        // Small screens use the bottom dock; this bar is desktop-only.
        "z-50 hidden w-full transition-[transform,background-color,border-color,box-shadow] duration-300 ease-in-out will-change-transform lg:block",
        hideBar ? "-translate-y-full" : "translate-y-0",
        isSearchPage
          ? cn(
              "lg:sticky lg:top-0 lg:bg-white",
              "transition-shadow duration-500 ease-in-out",
              linksHidden ? "shadow-md shadow-black/5" : "shadow-none",
            )
          : isHomePage
            ? cn(
                "lg:fixed lg:inset-x-0 lg:top-0",
                navVariant === "hero"
                  ? "lg:border-0 lg:bg-transparent lg:shadow-none"
                  : "lg:border-b lg:border-brand/20 lg:bg-white lg:shadow-sm",
              )
            : "lg:sticky lg:top-0 lg:border-b lg:border-brand/20 lg:bg-white",
        className,
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Logo size="default" variant={navVariant} />

          {/* Fixed-height stage so hiding the links never changes the row
              height while the search bar animates into this space. */}
          <div className="relative hidden min-w-0 flex-1 self-stretch lg:block">
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
                linksHidden
                  ? "pointer-events-none scale-95 opacity-0"
                  : "scale-100 opacity-100",
              )}
              aria-hidden={linksHidden}
            >
              <NavbarDesktopNav variant={navVariant} />
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <NavbarLoginButton variant={navVariant} />
          </div>
        </div>
      </Container>
    </header>
  );
}
