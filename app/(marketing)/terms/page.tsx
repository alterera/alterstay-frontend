import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { termsSections } from "@/config/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Alterstay terms and conditions for booking stays online.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms & Conditions"
      updatedAt="8 September 2026"
      intro="These Terms & Conditions govern your use of Alterstay and any bookings made through our platform. Please read them carefully before completing a reservation."
      sections={termsSections}
    />
  );
}
