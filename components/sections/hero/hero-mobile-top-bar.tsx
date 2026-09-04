"use client";

import Link from "next/link";
import { HeadphonesIcon, WalletIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/common/logo";
import { ROUTES } from "@/constants/routes";

export function HeroMobileTopBar() {
  const { isAuthenticated, user } = useAuth();
  const coins = Math.floor(user?.alterCashBalance ?? 0);

  return (
    <div className="mb-4 flex w-full items-center justify-between gap-3 lg:hidden">
      <Logo
        size="sm"
        className="rounded-md bg-white/95 px-2 py-1 shadow-sm"
      />

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <Link
            href={ROUTES.wallet}
            aria-label={`${coins} coins in wallet`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-2.5 text-neutral-900 shadow-sm"
          >
            <WalletIcon className="size-4" />
            <span className="text-xs font-semibold tabular-nums">{coins}</span>
          </Link>
        ) : null}

        <Link
          href={ROUTES.help.support}
          aria-label="Helpline"
          className="inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-sm"
        >
          <HeadphonesIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}
