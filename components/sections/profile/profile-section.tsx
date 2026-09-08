"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon, PencilIcon, UserRoundIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { profileConfig } from "@/config/profile";
import { ROUTES } from "@/constants/routes";
import { fetchMyMembership } from "@/lib/membership-api";
import { cn } from "@/lib/utils";

import { ProfileMenuList } from "./profile-menu-list";

type ProfileSectionProps = {
  className?: string;
};

function getSavedName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

function formatPhone(phone?: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

function formatExpiry(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfileSection({ className }: ProfileSectionProps) {
  const { user, isAuthenticated, isLoading, openLogin, logout } = useAuth();
  const { title, welcomeBanner } = profileConfig;
  const [membershipTier, setMembershipTier] = useState(
    user?.membershipTier ?? "Free",
  );
  const [expiresAt, setExpiresAt] = useState<string | null>(
    user?.membershipExpiresAt ?? null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setMembershipTier("Free");
      setExpiresAt(null);
      return;
    }

    let cancelled = false;
    fetchMyMembership()
      .then((status) => {
        if (cancelled) return;
        setMembershipTier(status.active?.planName ?? status.tier ?? "Free");
        setExpiresAt(
          status.active?.expiresAt ??
            status.activeMembership?.expiresAt ??
            null,
        );
      })
      .catch(() => {
        if (cancelled) return;
        setMembershipTier(user?.membershipTier ?? "Free");
        setExpiresAt(user?.membershipExpiresAt ?? null);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.membershipExpiresAt, user?.membershipTier]);

  const menuGroups = isAuthenticated
    ? profileConfig.menuGroupsAuthenticated
    : profileConfig.menuGroupsGuest;

  const expiryLabel = formatExpiry(expiresAt);

  return (
    <section className={cn("bg-background pb-8 pt-6 lg:pb-10 lg:pt-24", className)}>
      <Container className="max-w-lg lg:max-w-2xl">
        <h1 className="mb-5 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        <div className="mb-4 rounded-md bg-brand p-4 text-white shadow-sm sm:p-5">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="size-32 rounded-full sm:size-36" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-32 rounded-md bg-white/20" />
                <Skeleton className="h-4 w-24 rounded-md bg-white/20" />
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  size="lg"
                  className="size-32 border border-white/20 after:border-white/20 sm:size-36"
                >
                  <AvatarImage src="/avatar.webp" alt="Profile avatar" />
                  <AvatarFallback className="bg-white/15 text-white">
                    <UserRoundIcon className="size-12 sm:size-14" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  {getSavedName(user?.firstName, user?.lastName) ? (
                    <>
                      <p className="truncate text-base font-semibold sm:text-lg">
                        {getSavedName(user?.firstName, user?.lastName)}
                      </p>
                      <p className="truncate text-xs text-white/80">
                        {formatPhone(user?.phone)}
                      </p>
                    </>
                  ) : (
                    <p className="truncate text-xs font-semibold sm:text-lg">
                      {formatPhone(user?.phone)}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={ROUTES.profileEdit}
                aria-label="Edit profile"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <PencilIcon className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-semibold sm:text-lg">
                {welcomeBanner.title}
              </p>
              <Button
                type="button"
                onClick={openLogin}
                className="shrink-0 rounded-xl bg-white px-5 text-sm font-semibold text-brand-dark hover:bg-white/90"
              >
                {welcomeBanner.loginLabel}
              </Button>
            </div>
          )}
        </div>

        <Link
          href={ROUTES.membership}
          className="mb-8 block rounded-md bg-neutral-950 p-4 text-left shadow-sm ring-1 ring-white/10 lg:hidden"
        >
          <p className="text-xs font-bold tracking-[0.18em] text-brand">
            ALTERSTAY
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="truncate text-base font-semibold text-white">
              {isAuthenticated ? membershipTier : "Membership"}
            </p>
            <ChevronRightIcon className="size-5 shrink-0 text-white/70" />
          </div>
          <p className="mt-3 text-xs text-white/70">
            {isAuthenticated && expiryLabel
              ? `Valid Until: ${expiryLabel}`
              : isAuthenticated
                ? "Explore plans & unlock member benefits"
                : "Join Alterstay membership for exclusive savings"}
          </p>
        </Link>

        <ProfileMenuList
          groups={menuGroups}
          onAction={(item) => {
            if (item.action === "logout") {
              void logout();
            }
          }}
        />
      </Container>
    </section>
  );
}
