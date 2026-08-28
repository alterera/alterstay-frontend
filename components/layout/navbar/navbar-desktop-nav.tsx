"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import { mainNavigation } from "@/config/navigation";
import { profileConfig } from "@/config/profile";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-none bg-transparent text-sm text-black/70 transition-colors hover:bg-transparent hover:text-black focus:bg-transparent focus:text-black data-open:bg-transparent data-open:text-black data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent";

const dropdownTriggerClass = cn(
  navLinkClass,
  "hover:text-brand data-open:text-brand data-popup-open:text-brand",
);

const dropdownItemClass =
  "flex flex-col items-start gap-0.5 rounded-lg p-3 text-left transition-colors hover:bg-muted/60 focus:bg-muted/60 focus-visible:ring-0 data-active:bg-muted/60 data-active:hover:bg-muted/60";

function getUserInitials(user: AuthUser): string {
  const first = user.firstName?.trim()?.[0] ?? "";
  const last = user.lastName?.trim()?.[0] ?? "";
  if (first || last) return `${first}${last}`.toUpperCase();
  return user.phone.replace(/\D/g, "").slice(-2) || "?";
}

export function NavbarDesktopNav() {
  return (
    <NavigationMenu align="start" className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {mainNavigation.map((item) => {
          if (item.type === "link") {
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    navLinkClass,
                    "hover:text-brand",
                  )}
                  render={<Link href={item.href} />}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger className={dropdownTriggerClass}>
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[320px] gap-1 p-2 text-left">
                  {item.items.map((subItem) => (
                    <li key={subItem.href}>
                      <NavigationMenuLink
                        className={dropdownItemClass}
                        render={<Link href={subItem.href} />}
                      >
                        <span className="text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                          {subItem.label}
                        </span>
                        {subItem.description ? (
                          <span className="text-left text-xs text-muted-foreground">
                            {subItem.description}
                          </span>
                        ) : null}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const accountButtonClass =
  "rounded-sm bg-[#ec1846] px-4 text-xs font-medium text-white hover:bg-brand/90";

export function NavbarLoginButton({ className }: { className?: string }) {
  const { user, isAuthenticated, isLoading, openLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        className={cn(
          "hidden h-10 w-28 animate-pulse rounded-sm bg-muted/60 lg:block",
          className,
        )}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        type="button"
        size="lg"
        variant="default"
        onClick={openLogin}
        className={cn(accountButtonClass, className)}
      >
        Login
      </Button>
    );
  }

  const initials = user ? getUserInitials(user) : "?";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            size="lg"
            variant="outline"
            className={cn(
              accountButtonClass,
              "gap-2",
              className,
            )}
          >
            <Avatar size="sm" className="size-6">
              <AvatarFallback className="bg-white/90 text-[10px] font-semibold text-brand">
                {initials}
              </AvatarFallback>
            </Avatar>
            My Account
            <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl p-1.5 shadow-lg"
      >
        <ul className="flex flex-col">
          {profileConfig.desktopAccountMenu.map((item) => {
            const Icon = item.icon;
            const isDanger = "tone" in item && item.tone === "danger";
            const itemClass = cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isDanger
                ? "text-destructive hover:bg-destructive/5"
                : "text-foreground hover:bg-muted",
            );

            if ("action" in item && item.action === "logout") {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={itemClass}
                    onClick={() => {
                      setOpen(false);
                      void logout();
                    }}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <Link
                  href={"href" in item ? item.href : "#"}
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
