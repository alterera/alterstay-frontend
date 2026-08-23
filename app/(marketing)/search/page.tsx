import { Suspense } from "react";

import { SearchPage } from "@/components/search/search-page";

export default function SearchRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading search…
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
