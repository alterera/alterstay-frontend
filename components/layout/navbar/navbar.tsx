"use client";

import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { useNavbarScrollHidden } from "@/hooks/use-navbar-scroll-hidden";
import { useOptionalSearchPageLayout } from "@/components/search/search-page-layout-context";
import { cn } from "@/lib/utils";

import { NavbarDesktopNav, NavbarLoginButton } from "./navbar-desktop-nav";

type NavbarProps = {
  className?: string;
};

export function Navbar({ className }: NavbarProps) {
  const layout = useOptionalSearchPageLayout();
  const isSearchPage = layout?.isSearchPage ?? false;
  const scrollHidden = useNavbarScrollHidden();
  /** The search bar morphs into this row, so the links step aside for it. */
  const linksHidden = isSearchPage && Boolean(layout?.navCollapsed);

  return (
    <header
      className={cn(
        // Small screens use the bottom dock; this bar is desktop-only.
        "z-50 hidden w-full transition-transform duration-300 ease-in-out will-change-transform lg:block",
        scrollHidden ? "-translate-y-full" : "translate-y-0",
        isSearchPage
          ? cn(
              "lg:sticky lg:top-0 lg:bg-white",
              "transition-shadow duration-500 ease-in-out",
              linksHidden ? "shadow-md shadow-black/5" : "shadow-none",
            )
          : "lg:sticky lg:top-0 lg:border-b lg:border-brand/20 lg:bg-white/80 lg:backdrop-blur-xl",
        className,
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Logo size="default" />

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
              <NavbarDesktopNav />
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <NavbarLoginButton />
          </div>
        </div>
      </Container>
    </header>
  );
}
