"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon, CrownIcon, WalletIcon } from "lucide-react";

import { AccountHero } from "@/components/account/account-hero";
import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { user: sessionUser, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(sessionUser);
  const [membershipTier, setMembershipTier] = useState<string | null>(null);
  const [membershipExpiresAt, setMembershipExpiresAt] = useState<string | null>(
    null,
  );
  const [membershipLoading, setMembershipLoading] = useState(true);

  const loadHeader = useCallback(async () => {
    setMembershipLoading(true);
    const [data, membership] = await Promise.all([
      fetchCurrentUser(),
      fetchMyMembership().catch(() => null),
    ]);
    setProfile(data);
    if (membership) {
      setMembershipTier(membership.active?.planName ?? membership.tier ?? "Free");
      setMembershipExpiresAt(membership.active?.expiresAt ?? null);
    } else {
      setMembershipTier("Free");
      setMembershipExpiresAt(null);
    }
    setMembershipLoading(false);
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
      <AccountHero
        title={fullName}
        subtitle={profile?.phone ?? undefined}
        backHref={ROUTES.profile}
        backLabel="Back to profile"
        showBackOnMobile
        rightSlot={
          <Link
            href={ROUTES.wallet}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark/80 px-3 py-2 text-xs font-medium sm:w-auto sm:text-sm"
          >
            <WalletIcon className="size-4 text-premium" />
            <span>
              Coins : {(profile?.alterCashBalance ?? 0).toLocaleString("en-IN")}
            </span>
            <span aria-hidden>›</span>
          </Link>
        }
      />

      <Container className="mt-4 max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="overflow-hidden rounded-md border border-brand/15 bg-gradient-to-br from-brand/8 via-white to-premium/10">
              {membershipLoading ? (
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              ) : (
                <Link
                  href={ROUTES.membership}
                  className="group block p-4 transition-colors hover:bg-white/60"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand/80 text-white shadow-sm">
                      <CrownIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
                        Membership
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {membershipExpiresAt ? membershipTier : "Free member"}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {membershipExpiresAt
                          ? `Valid until ${formatMembershipExpiry(membershipExpiresAt)}`
                          : "Unlock member rates, coins, and exclusive offers"}
                      </p>
                    </div>
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-3 rounded-md border border-brand/15 bg-white/80 px-3 py-2 text-xs font-medium text-brand">
                    {membershipExpiresAt
                      ? "Manage membership"
                      : "Explore membership plans"}
                  </div>
                </Link>
              )}
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

          <div className="rounded-md border bg-white p-5 sm:p-6">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
