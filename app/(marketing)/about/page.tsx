import type { Metadata } from "next";

import { AboutPage } from "@/components/static/about-page";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Alterstay and our mission to make booking stays across India simple and trusted.",
};

export default function AboutRoutePage() {
  return <AboutPage />;
}
