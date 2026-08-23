"use client";

import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { useOptionalSearchPageLayout } from "@/components/search/search-page-layout-context";
import { cn } from "@/lib/utils";

import { NavbarDesktopNav, NavbarLoginButton } from "./navbar-desktop-nav";

type NavbarProps = {
  className?: string;
};

export function Navbar({ className }: NavbarProps) {
  const layout = useOptionalSearchPageLayout();
  const isSearchPage = layout?.isSearchPage ?? false;
  /** The search bar morphs into this row, so the links step aside for it. */
  const linksHidden = isSearchPage && Boolean(layout?.navCollapsed);

  return (
    <header
      className={cn(
        // Small screens use the bottom dock; this bar is desktop-only.
        "z-50 hidden w-full lg:block",
        isSearchPage
          ? // Search page: opaque sticky bar. Kept borderless (exactly 56px)
            // so the search bar can align with it; the edge is a shadow that
            // only shows once the bar moves in.
            cn(
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
