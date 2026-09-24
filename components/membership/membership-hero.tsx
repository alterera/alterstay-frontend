"use client";

import Link from "next/link";

import { AccountHero } from "@/components/account/account-hero";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import type { MembershipStatus } from "@/types/membership";

type MembershipHeroProps = {
  status: MembershipStatus | null;
  loading?: boolean;
};

function displayName(
  firstName?: string | null,
  lastName?: string | null,
  phone?: string | null,
) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || phone || "Member";
}

export function MembershipHero({ status, loading }: MembershipHeroProps) {
  const { user } = useAuth();
  const tier = status?.tier ?? "Free";
  const hasActive = Boolean(status?.active);

  return (
    <AccountHero
      loading={loading}
      title={displayName(user?.firstName, user?.lastName, user?.phone)}
      subtitle={
        <>
          <span className="font-medium text-white">{tier}</span>
        </>
      }
      backHref={ROUTES.profile}
      backLabel="Back to profile"
      showBackOnMobile
      rightSlot={
        loading ? (
          <>
            <Skeleton className="h-9 flex-1 rounded-md bg-white/15 sm:h-9 sm:w-28 sm:flex-none" />
          </>
        ) : (
          <>
            <Button
              render={<Link href={ROUTES.profileEdit} />}
              variant="outline"
              size="sm"
              className="h-9 flex-1 rounded-md border-white/30 bg-white/10 px-4 text-xs font-medium text-white hover:bg-white/20 sm:flex-none sm:text-sm"
            >
              Edit profile
            </Button>
            {!hasActive ? (
              <Button
                render={<Link href={ROUTES.membershipPlans} />}
                size="sm"
                className="h-9 flex-1 rounded-md bg-white px-4 text-xs font-medium text-brand hover:bg-white/90 sm:flex-none sm:text-sm"
              >
                Upgrade
              </Button>
            ) : null}
          </>
        )
      }
    />
  );
}
