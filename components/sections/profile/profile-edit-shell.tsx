"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { fetchCurrentUser } from "@/lib/auth-api";
import { fetchMyMembership } from "@/lib/membership-api";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

export type ProfileShellNavId = "profile" | "guests";

const NAV_ITEMS: { id: ProfileShellNavId; label: string; href: string }[] = [
  { id: "profile", label: "My Profile", href: ROUTES.profileEdit },
  { id: "guests", label: "Guest Details", href: ROUTES.profileGuests },
];

function displayName(user: AuthUser | null) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return name || "Guest";
}

function formatMembershipExpiry(value?: string | null) {
  if (!value) return "No expiry";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type ProfileEditShellProps = {
  activeNav: ProfileShellNavId;
  children: ReactNode;
};

export function ProfileEditShell({ activeNav, children }: ProfileEditShellProps) {
  const router = useRouter();
  const { user: sessionUser, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(sessionUser);
  const [membershipTier, setMembershipTier] = useState("Free");
  const [membershipExpiresAt, setMembershipExpiresAt] = useState<string | null>(
    null,
  );

  const loadHeader = useCallback(async () => {
    const [data, membership] = await Promise.all([
      fetchCurrentUser(),
      fetchMyMembership().catch(() => null),
    ]);
    setProfile(data);
    if (membership) {
      setMembershipTier(membership.tier);
      setMembershipExpiresAt(membership.active?.expiresAt ?? null);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadHeader().catch(() => undefined);
  }, [isAuthenticated, loadHeader]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  const fullName = displayName(profile);

  return (
    <section className="bg-background pb-10 pt-0">
      <div className="bg-brand px-4 py-5 text-white sm:px-6">
        <Container className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => router.push(ROUTES.profile)}
              aria-label="Back to profile"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <Avatar
              size="lg"
              className="size-12 border border-white/20 after:border-white/20"
            >
              <AvatarImage src="/avatar.webp" alt="Profile avatar" />
              <AvatarFallback className="bg-white/15 text-white">
                <UserRoundIcon className="size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">
                {fullName}
              </h1>
              {profile?.phone ? (
                <p className="mt-1 truncate text-xs text-white/80">
                  {profile.phone}
                </p>
              ) : null}
            </div>
          </div>

          <Link
            href={ROUTES.wallet}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-dark/80 px-3 py-2 text-xs font-medium sm:text-sm"
          >
            <WalletIcon className="size-4 text-premium" />
            <span>
              Coins : {(profile?.alterCashBalance ?? 0).toLocaleString("en-IN")}
            </span>
            <span aria-hidden>›</span>
          </Link>
        </Container>
      </div>

      <Container className="mt-4 max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-md border bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <BadgeCheckIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{membershipTier}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {membershipExpiresAt
                      ? `Expires ${formatMembershipExpiry(membershipExpiresAt)}`
                      : "No active membership"}
                  </p>
                  <Link
                    href={ROUTES.membership}
                    className="mt-2 inline-block text-xs font-medium text-brand underline"
                  >
                    {membershipExpiresAt ? "Renew or upgrade" : "Get membership"}
                  </Link>
                </div>
              </div>
            </div>

            <nav className="overflow-hidden rounded-md border bg-white">
              {NAV_ITEMS.map((item) => {
                const active = activeNav === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "block w-full border-b px-4 py-3.5 text-left text-sm font-medium last:border-b-0",
                      active
                        ? "bg-brand/5 text-brand"
                        : "text-foreground hover:bg-muted/40",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="rounded-md border bg-white p-5 shadow-sm sm:p-6">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
