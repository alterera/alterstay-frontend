"use client";

import Link from "next/link";
import { UserRoundIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import type { MembershipStatus } from "@/types/membership";

type MembershipHeroProps = {
  status: MembershipStatus | null;
  loading?: boolean;
};

export function MembershipHero({ status, loading }: MembershipHeroProps) {
  const { isAuthenticated, openLogin } = useAuth();

  return (
    <div className="bg-brand px-4 py-6 text-white sm:px-6 sm:py-8">
      <Container className="flex justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Avatar
            size="lg"
            className="size-16 border border-white/20 after:border-white/20 sm:size-20"
          >
            <AvatarImage src="/avatar.webp" alt="Membership avatar" />
            <AvatarFallback className="bg-white/15 text-white">
              <UserRoundIcon className="size-7 sm:size-8" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold sm:text-2xl">Membership</h1>
            <p className="mt-0.5 text-sm text-white/80">
              {loading ? (
                <Skeleton className="inline-block h-4 w-36 rounded-md bg-white/20" />
              ) : isAuthenticated ? (
                `${status?.tier ?? "Free"} (current tier)`
              ) : (
                "Sign in to view your membership"
              )}
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
