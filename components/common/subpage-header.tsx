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
};

export function SubpageHeader({
  title,
  backHref = "/",
  backLabel = "Go back",
  className,
  rightSlot,
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
        "sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-lg"
          onClick={handleBack}
          aria-label={backLabel}
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
        <h1 className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight sm:text-lg">
          {title}
        </h1>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </header>
  );
}
