import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { HelpPage } from "@/components/help/help-page";

export const metadata: Metadata = {
  title: "Help",
  description: "Get help with your Alterstay bookings.",
};

export default function HelpRoutePage() {
  return (
    <RequireAuth>
      <HelpPage />
    </RequireAuth>
  );
}
