import type { Metadata } from "next";
import { Suspense } from "react";

import { MembershipPlansPage } from "@/components/membership/membership-plans-page";

export const metadata: Metadata = {
  title: "Available Plans",
};

export default function MembershipPlansRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading plans…
        </div>
      }
    >
      <MembershipPlansPage />
    </Suspense>
  );
}
