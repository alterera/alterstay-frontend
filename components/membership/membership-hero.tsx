"use client";

import Link from "next/link";
import { BadgeCheckIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { MembershipStatus } from "@/types/membership";

type MembershipHeroProps = {
  status: MembershipStatus | null;
  loading?: boolean;
};

export function MembershipHero({ status, loading }: MembershipHeroProps) {
  const { isAuthenticated, openLogin } = useAuth();

  return (
    <div className="bg-gradient-premium px-4 py-6 text-white sm:px-6 sm:py-8">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15">
            <BadgeCheckIcon className="size-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold sm:text-2xl">
              AlterStay Membership
            </h1>
            <p className="mt-0.5 text-sm text-white/80">
              {loading
                ? "Loading…"
                : isAuthenticated
                  ? `${status?.tier ?? "Free"} (current tier)`
                  : "Sign in to view your membership"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {isAuthenticated ? (
            <Button
              render={<Link href={ROUTES.profileEdit} />}
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={() => openLogin()}
            >
              Sign in
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
