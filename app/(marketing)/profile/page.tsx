import type { Metadata } from "next";

import { ProfileSection } from "@/components/sections/profile";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your AlterStays account, support options, and legal settings.",
};

export default function ProfilePage() {
  return <ProfileSection />;
}
