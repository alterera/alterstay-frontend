"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercentIcon,
  BriefcaseIcon,
  HomeIcon,
  UserIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { mobileDockNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

const dockIcons = {
  home: HomeIcon,
  bookings: BriefcaseIcon,
  offers: BadgePercentIcon,
  profile: UserIcon,
} as const;

function isDockItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileDock() {
  const pathname = usePathname();
  const { isAuthenticated, openLogin } = useAuth();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-4">
        {mobileDockNavigation.map((item) => {
          const active = isDockItemActive(pathname, item.href);
          const Icon = dockIcons[item.id];
          const isLogin = item.id === "profile" && !isAuthenticated;
          const label = isLogin ? "Login" : item.label;

          return (
            <li key={item.id} className="min-w-0">
              {isLogin ? (
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-1 px-1 transition-colors",
                    "text-muted-foreground",
                  )}
                >
                  <Icon
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-medium leading-none sm:text-[11px]">
                    {label}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 px-1 transition-colors",
                    active ? "text-brand" : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className="size-5"
                    strokeWidth={active ? 2.25 : 1.75}
                    fill={active && item.id === "home" ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-medium leading-none sm:text-[11px]">
                    {label}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
