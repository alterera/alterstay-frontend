import type { Metadata } from "next";

import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { privacySections } from "@/config/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Alterstay collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      updatedAt="8 September 2026"
      intro="This Privacy Policy explains what information Alterstay collects, why we collect it, and how we protect it when you use our website, app, and booking services."
      sections={privacySections}
    />
  );
}
