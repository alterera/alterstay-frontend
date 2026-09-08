import type { Metadata } from "next";

import { SubpageHeader } from "@/components/common/subpage-header";
import { FaqsSection } from "@/components/sections/faqs";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about booking with Alterstay.",
};

export default function HelpFaqRoutePage() {
  return (
    <>
      <SubpageHeader title="FAQs" backHref={ROUTES.help.root} />
      <FaqsSection className="pt-6 sm:pt-10" />
    </>
  );
}
