"use client";

import { usePathname } from "next/navigation";

import { AuthDialogs, AuthProvider } from "@/components/auth";
import { SiteFooter } from "@/components/layout/footer";
import { MobileDock, Navbar } from "@/components/layout/navbar";
import { SearchPageLayoutProvider } from "@/components/search/search-page-layout-context";
import { useNavbarScrollHidden } from "@/hooks/use-navbar-scroll-hidden";
import { cn } from "@/lib/utils";

function MarketingShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith("/search");
  const isPropertyPage = pathname.startsWith("/properties/");
  const isBookingFlow = /\/properties\/[^/]+\/(book|checkout)/.test(pathname);
  const hideFooter =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/bookings");
  const hideMobileDock = isSearchPage || isPropertyPage || isBookingFlow;
  const dockHidden = useNavbarScrollHidden(12);

  return (
    <SearchPageLayoutProvider>
      <Navbar />
      <main
        className={
          isSearchPage || isPropertyPage || isBookingFlow
            ? "flex-1"
            : "flex-1 pb-0"
        }
      >
        {children}
      </main>
      {hideFooter ? null : <SiteFooter />}
      {hideMobileDock ? null : (
        <div
          aria-hidden
          className={cn(
            "shrink-0 bg-background transition-[height] duration-300 ease-in-out lg:hidden",
            dockHidden ? "h-0" : "h-16",
          )}
        />
      )}
      {hideMobileDock ? null : <MobileDock />}
      <AuthDialogs />
    </SearchPageLayoutProvider>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MarketingShellInner>{children}</MarketingShellInner>
    </AuthProvider>
  );
}
