import { Suspense } from "react";

import { MembershipResultPage } from "@/components/membership/membership-result-page";

export default function MembershipResultRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading payment status…
        </div>
      }
    >
      <MembershipResultPage />
    </Suspense>
  );
}
