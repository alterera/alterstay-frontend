import type { Metadata } from "next";

import { HelpPage } from "@/components/help/help-page";

export const metadata: Metadata = {
  title: "Help",
  description: "Get help with your Alterstay bookings.",
};

export default function HelpRoutePage() {
  return <HelpPage />;
}
