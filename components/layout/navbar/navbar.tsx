"use client";

import { usePathname } from "next/navigation";

import { Logo } from "@/components/common/logo";
import { Container } from "@/components/common/container";
import { useOptionalSearchPageLayout } from "@/components/search/search-page-layout-context";
import { cn } from "@/lib/utils";

import { NavbarDesktopNav, NavbarLoginButton } from "./navbar-desktop-nav";

type NavbarProps = {
  className?: string;
};

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const layout = useOptionalSearchPageLayout();
  const isSearchPage = layout?.isSearchPage ?? false;
  const navVariant = isHomePage ? "hero" : "default";
  /** The search bar morphs into this row, so the links step aside for it. */
  const linksHidden = isSearchPage && Boolean(layout?.navCollapsed);

  return (
    <header
      className={cn(
        "relative z-50 hidden w-full transition-[background-color,border-color,box-shadow] duration-300 ease-in-out lg:block",
        isHomePage
          ? "border-0 bg-transparent shadow-none"
          : cn(
              "border-b border-brand/20 bg-white",
              isSearchPage &&
                cn(
                  "transition-shadow duration-500 ease-in-out",
                  linksHidden ? "shadow-md shadow-black/5" : "shadow-none",
                ),
            ),
        className,
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Logo size="default" variant={navVariant} />

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
