"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubpageHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
  rightSlot?: React.ReactNode;
  /** When true, header is only shown on mobile (hidden from lg breakpoint up). */
  mobileOnly?: boolean;
  /** When true, back button is only shown on mobile (hidden from lg breakpoint up). */
  backMobileOnly?: boolean;
  /** App-style brand bar on mobile (footer / static pages). */
  variant?: "default" | "brand";
};

export function SubpageHeader({
  title,
  backHref = "/",
  backLabel = "Go back",
  className,
  rightSlot,
  mobileOnly = false,
  backMobileOnly = false,
  variant = "default",
}: SubpageHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        variant === "brand"
          ? "border-b border-brand/20 bg-brand pt-[env(safe-area-inset-top,0px)] text-white lg:border-border/70 lg:bg-background/95 lg:text-foreground lg:backdrop-blur lg:supports-[backdrop-filter]:bg-background/80"
          : "border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        mobileOnly && "lg:hidden",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center gap-2 px-3 sm:px-6 lg:h-14 lg:gap-3 lg:px-8",
          variant === "brand" ? "h-11" : "h-14",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(
            "shrink-0 rounded-lg",
            variant === "brand" &&
              "text-white hover:bg-white/15 hover:text-white lg:text-foreground lg:hover:bg-muted",
            backMobileOnly && "lg:hidden",
          )}
          onClick={handleBack}
          aria-label={backLabel}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h1
          className={cn(
            "min-w-0 flex-1 truncate text-base font-semibold tracking-tight sm:text-lg",
            backMobileOnly && "lg:pl-0",
          )}
        >
          {title}
        </h1>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </header>
  );
}
