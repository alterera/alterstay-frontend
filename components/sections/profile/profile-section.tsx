"use client";

import Link from "next/link";
import { PencilIcon, UserRoundIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { profileConfig } from "@/config/profile";
import { ROUTES } from "@/constants/routes";
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
  // Display as +91 98765 43210 when possible
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

export function ProfileSection({ className }: ProfileSectionProps) {
  const { user, isAuthenticated, isLoading, openLogin, logout } = useAuth();
  const { title, welcomeBanner } = profileConfig;

  const menuGroups = isAuthenticated
    ? profileConfig.menuGroupsAuthenticated
    : profileConfig.menuGroupsGuest;

  return (
    <section className={cn("bg-background pb-8 pt-6 lg:pt-24", className)}>
      <Container className="max-w-lg lg:max-w-2xl">
        <h1 className="mb-5 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        <div className="mb-8 rounded-2xl bg-gradient-premium p-4 text-white shadow-sm sm:p-5">
          {isLoading ? (
            <div className="h-12 animate-pulse rounded-xl bg-white/10" />
          ) : isAuthenticated ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  size="lg"
                  className="size-12 border border-white/20 bg-white/15 text-white after:border-white/20"
                >
                  <AvatarFallback className="bg-transparent text-white">
                    <UserRoundIcon className="size-6" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  {getSavedName(user?.firstName, user?.lastName) ? (
                    <>
                      <p className="truncate text-base font-semibold sm:text-lg">
                        {getSavedName(user?.firstName, user?.lastName)}
                      </p>
                      <p className="truncate text-sm text-white/80">
                        {formatPhone(user?.phone)}
                      </p>
                    </>
                  ) : (
                    <p className="truncate text-base font-semibold sm:text-lg">
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

        <ProfileMenuList
          groups={menuGroups}
          onAction={(item) => {
            if (item.action === "logout") {
              void logout();
            }
          }}
        />

        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-6 w-full rounded-xl border border-destructive/30 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
          >
            Logout
          </button>
        ) : null}
      </Container>
    </section>
  );
}
