import type { Metadata } from "next";

import { ContactPage } from "@/components/static/contact-page";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Alterstay for booking help, partnerships, and support.",
};

export default function ContactRoutePage() {
  return <ContactPage />;
}
