import { Suspense } from "react";

import { MembershipPage } from "@/components/membership/membership-page";

export default function MembershipRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading membership…
        </div>
      }
    >
      <MembershipPage />
    </Suspense>
  );
}
