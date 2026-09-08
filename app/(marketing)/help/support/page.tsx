import type { Metadata } from "next";
import { Suspense } from "react";

import { HelpSupportPage } from "@/components/help/help-support-page";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact Alterstay support about your booking.",
};

export default function HelpSupportRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading support…
        </div>
      }
    >
      <HelpSupportPage />
    </Suspense>
  );
}
