import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { cancellationSections } from "@/config/legal";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "How cancellations and refunds work for Alterstay bookings.",
};

export default function CancellationPolicyPage() {
  return (
    <LegalPageShell
      title="Cancellation Policy"
      updatedAt="8 September 2026"
      intro="This page explains how cancellations, no-shows, and refunds work on Alterstay. Your specific booking confirmation always controls the exact free-cancellation window and fees."
      sections={cancellationSections}
    />
  );
}
