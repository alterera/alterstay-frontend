"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { membershipConfig } from "@/config/membership";
import { cn } from "@/lib/utils";

type MembershipBannerProps = {
  className?: string;
};

export function MembershipBanner({ className }: MembershipBannerProps) {
  const { isAuthenticated, isLoading, openLogin } = useAuth();
  const { headline, subheadline, loginLabel, joinLabel, memberNote, features } =
    membershipConfig;

  const showAuthActions = !isLoading && !isAuthenticated;

  return (
    <section className={cn("bg-background py-6 sm:py-8 lg:py-10", className)}>
      <Container>
        <div className="rounded-3xl bg-[#e31c3d] px-8 py-8 text-white sm:px-4 sm:py-5 lg:px-5 lg:py-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-md shrink-0">
              <h2 className="text-2xl font-bold tracking-tight sm:text-xl lg:text-[1.5rem] lg:leading-tight">
                {headline}
              </h2>
              <p className="text-sm text-white/90 sm:text-base">
                {subheadline}
              </p>

              {showAuthActions ? (
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={openLogin}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white bg-transparent px-5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    {loginLabel}
                  </button>
                  <button
                    type="button"
                    onClick={openLogin}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    {joinLabel}
                  </button>
                </div>
              ) : null}

              {!isLoading && isAuthenticated ? (
                <p className="mt-5 text-sm text-white/85">{memberNote}</p>
              ) : null}
            </div>

            <div className="w-full rounded-2xl bg-[#ec1846] px-4 py-6 sm:px-6 sm:py-8 lg:flex-1">
              <ul className="grid grid-cols-2 bor gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-5">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li
                      key={feature.id}
                      className="flex flex-col items-center text-center"
                    >
                      <Icon
                        className="size-8 text-white sm:size-9"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <p className="mt-3 max-w-42 text-xs leading-snug font-medium sm:text-sm">
                        {feature.label}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
