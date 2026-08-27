import type { Metadata } from "next";

import { ProfileAccountPage } from "@/components/sections/profile";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your AlterStays account and personal details.",
};

export default function ProfilePage() {
  return <ProfileAccountPage />;
}
