import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Contact Help",
};

export default function HelpContactRoutePage() {
  redirect(ROUTES.help.root);
}
