import type { Metadata } from "next";

import { ProfileGuestsPage } from "@/components/sections/profile/profile-guests-page";

export const metadata: Metadata = {
  title: "Guest Details",
  description: "Manage saved guests for faster booking checkout.",
};

export default function ProfileGuestsRoutePage() {
  return <ProfileGuestsPage />;
}
