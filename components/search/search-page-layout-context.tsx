"use client";

import { createContext, useContext, useMemo, useState } from "react";

type SearchPageLayoutContextValue = {
  /** True while the search page is mounted (desktop navbar hosts the search). */
  isSearchPage: boolean;
  setIsSearchPage: (value: boolean) => void;
  /** True once the search bar has morphed into the navbar, so links hide. */
  navCollapsed: boolean;
  setNavCollapsed: (value: boolean) => void;
};

const SearchPageLayoutContext =
  createContext<SearchPageLayoutContextValue | null>(null);

export function SearchPageLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);

  const value = useMemo(
    () => ({ isSearchPage, setIsSearchPage, navCollapsed, setNavCollapsed }),
    [isSearchPage, navCollapsed],
  );

  return (
    <SearchPageLayoutContext.Provider value={value}>
      {children}
    </SearchPageLayoutContext.Provider>
  );
}

export function useSearchPageLayout() {
  const context = useContext(SearchPageLayoutContext);
  if (!context) {
    throw new Error(
      "useSearchPageLayout must be used within SearchPageLayoutProvider",
    );
  }
  return context;
}

export function useOptionalSearchPageLayout() {
  return useContext(SearchPageLayoutContext);
}
