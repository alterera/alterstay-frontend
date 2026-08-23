"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercentIcon,
  BriefcaseIcon,
  HeartIcon,
  HomeIcon,
  UserIcon,
} from "lucide-react";

import { mobileDockNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

const dockIcons = {
  home: HomeIcon,
  favourites: HeartIcon,
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

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {mobileDockNavigation.map((item) => {
          const active = isDockItemActive(pathname, item.href);
          const Icon = dockIcons[item.id];

          return (
            <li key={item.id} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 px-1 transition-colors",
                  active ? "text-brand" : "text-muted-foreground"
                )}
              >
                <Icon
                  className="size-5"
                  strokeWidth={active ? 2.25 : 1.75}
                  fill={active && item.id === "home" ? "currentColor" : "none"}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-medium leading-none sm:text-[11px]">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
