"use client";

import { usePathname } from "next/navigation";

import { AuthDialogs, AuthProvider } from "@/components/auth";
import { SiteFooter } from "@/components/layout/footer";
import { MobileDock, Navbar } from "@/components/layout/navbar";
import { SearchPageLayoutProvider } from "@/components/search/search-page-layout-context";
import { ROUTES } from "@/constants/routes";
import { isMarketingAppStylePage } from "@/lib/marketing-app-pages";

function MarketingShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith("/search");
  const isPropertyPage = pathname.startsWith("/properties/");
  const isBookingFlow = /\/properties\/[^/]+\/(book|checkout)/.test(pathname);
  const hideFooter =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/bookings");
  const appStylePage = isMarketingAppStylePage(pathname);
  const isPaymentResultPage =
    pathname === ROUTES.bookingResult ||
    pathname === ROUTES.membershipResult;
  const hideMobileDock =
    isSearchPage ||
    isPropertyPage ||
    isBookingFlow ||
    appStylePage ||
    isPaymentResultPage;
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
        <div aria-hidden className="h-16 shrink-0 bg-background lg:hidden" />
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
