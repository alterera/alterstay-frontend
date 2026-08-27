import type { Metadata } from "next";

import { ProfilePage } from "@/components/sections/profile";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your AlterStays account and personal details.",
};

export default function Page() {
  return <ProfilePage />;
}
