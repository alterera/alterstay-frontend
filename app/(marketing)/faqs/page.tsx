import type { Metadata } from "next";

import { FaqsPage } from "@/components/faqs/faqs-page";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about booking, membership, and Alterstay coins — all in one place.",
};

export default function FaqsRoutePage() {
  return <FaqsPage />;
}
