"use client";

import Link from "next/link";
import { CrownIcon, UserRoundIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import type { MembershipStatus } from "@/types/membership";
import Image from "next/image";

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
    <div className="relative overflow-hidden bg-brand px-4 py-8 text-white sm:px-6 sm:py-10 lg:py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_0%,rgba(255,255,255,0.12),transparent)]"
        aria-hidden="true"
      />
      <Container className="relative max-w-6xl">
        <div className="flex items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-5 sm:gap-6">
              <Image src="/avatar.webp" alt="Membership avatar" width={60} height={60} />
            <div className="min-w-0">
              <h1 className="mt-3 truncate text-lg font-bold sm:text-sm">
                {displayName(user?.firstName, user?.lastName, user?.phone)}
              </h1>
              <div className="mt-1 text-sm text-white/80 sm:text-xs">
                {loading ? (
                  <Skeleton className="mt-1 h-4 w-44 rounded-md bg-white/20" />
                ) : (
                  <>
                    Current tier:{" "}
                    <span className="font-semibold text-white">{tier}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              render={<Link href={ROUTES.profileEdit} />}
              variant="outline"
              className="rounded-md border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Edit profile
            </Button>
            {!loading && !hasActive ? (
              <Button
                render={<Link href={ROUTES.membershipPlans} />}
                className="rounded-md bg-white text-brand hover:bg-white/90"
              >
                Upgrade
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
