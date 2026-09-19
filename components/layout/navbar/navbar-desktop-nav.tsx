"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import { mainNavigation } from "@/config/navigation";
import { ROUTES } from "@/constants/routes";
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
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-none bg-transparent text-sm text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-open:bg-transparent data-open:text-foreground data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent";

const dropdownTriggerClass = cn(
  navLinkClass,
  "hover:text-brand data-open:text-brand data-popup-open:text-brand",
);

const dropdownItemClass =
  "flex w-fit flex-col items-start gap-0 rounded-md px-2.5 py-1.5 text-left transition-colors hover:text-brand/60 focus:bg-muted/60 focus-visible:ring-0 data-active:bg-muted/60 data-active:hover:bg-muted/60";

export function NavbarDesktopNav() {
  const { isAuthenticated } = useAuth();

  const navigation = mainNavigation.map((item) => {
    if (item.type !== "dropdown") return item;
    return {
      ...item,
      items: item.items.filter(
        (subItem) =>
          subItem.href !== ROUTES.help.root || isAuthenticated,
      ),
    };
  });

  return (
    <NavigationMenu align="start" className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {navigation.map((item) => {
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
              <NavigationMenuContent className="w-fit min-w-0 p-0.5">
                <ul className="flex w-fit flex-col gap-0.5">
                  {item.items.map((subItem) => (
                    <li key={subItem.href} className="w-fit">
                      <NavigationMenuLink
                        className={dropdownItemClass}
                        render={<Link href={subItem.href} />}
                      >
                        <span className="whitespace-nowrap text-sm font-medium text-foreground transition-colors group-hover:text-brand">
                          {subItem.label}
                        </span>
                        {subItem.description ? (
                          <span className="max-w-[200px] text-left text-[11px] leading-tight text-muted-foreground">
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
  "rounded-sm px-4 text-xs font-medium text-white shadow-none bg-brand hover:bg-brand/90 hover:text-white";

export function NavbarLoginButton({ className }: { className?: string }) {
  const { isAuthenticated, isLoading, openLogin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        className={cn(
          "hidden h-10 w-28 animate-pulse rounded-sm lg:block",
          className,
        )}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        type="button"
        size="default"
        variant="default"
        onClick={openLogin}
        className={cn(accountButtonClass, className)}
      >
        Login
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            size="lg"
            variant="default"
            className={cn(
              accountButtonClass,
              "gap-2 cursor-pointer",
              className,
            )}
          >
            My Account
            <ChevronDownIcon
              className={cn(
                "size-3.5 opacity-70 transition-transform duration-200",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </Button>
        }
      />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-md p-1.5 shadow-lg"
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
