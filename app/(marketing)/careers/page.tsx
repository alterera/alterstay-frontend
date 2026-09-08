import type { Metadata } from "next";

import { CareersPage } from "@/components/static/careers-page";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Alterstay team and help build trusted travel booking in India.",
};

export default function CareersRoutePage() {
  return <CareersPage />;
}
