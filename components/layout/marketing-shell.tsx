"use client";

import { usePathname } from "next/navigation";

import { AuthDialogs, AuthProvider } from "@/components/auth";
import { SiteFooter } from "@/components/layout/footer";
import { MobileDock, Navbar } from "@/components/layout/navbar";
import { SearchPageLayoutProvider } from "@/components/search/search-page-layout-context";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith("/search");
  const isPropertyPage = pathname.startsWith("/properties/");
  const isBookingFlow = /\/properties\/[^/]+\/book/.test(pathname);
  const hideFooter =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/bookings");
  const hideMobileDock = isSearchPage || isPropertyPage || isBookingFlow;

  return (
    <AuthProvider>
      <SearchPageLayoutProvider>
        <Navbar />
        <main
          className={
            isSearchPage || isPropertyPage || isBookingFlow
              ? "flex-1"
              : "flex-1 pb-16 lg:pb-0"
          }
        >
          {children}
        </main>
        {hideFooter ? null : <SiteFooter />}
        {hideMobileDock ? null : <MobileDock />}
        <AuthDialogs />
      </SearchPageLayoutProvider>
    </AuthProvider>
  );
}
