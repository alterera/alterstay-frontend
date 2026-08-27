"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { ProfileAccountPage } from "./profile-account-page";
import { ProfileSection } from "./profile-section";

/** Mobile hub for all users; full account editor on desktop when signed in. */
export function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <ProfileSection />;
  }

  return (
    <>
      <div className="lg:hidden">
        <ProfileSection />
      </div>
      <div className="hidden lg:block">
        <ProfileAccountPage />
      </div>
    </>
  );
}
