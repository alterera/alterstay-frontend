import type { Metadata } from "next";

import { ProfileAccountPage } from "@/components/sections/profile";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your AlterStays account details.",
};

export default function ProfileEditPage() {
  return <ProfileAccountPage />;
}
