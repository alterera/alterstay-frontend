"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ACCOUNT_HERO_AVATAR_SIZE = 60;

type AccountHeroProps = {
  title: string;
  subtitle?: React.ReactNode;
  loading?: boolean;
  backHref?: string;
  backLabel?: string;
  showBackOnMobile?: boolean;
  rightSlot?: React.ReactNode;
  className?: string;
};

export function AccountHero({
  title,
  subtitle,
  loading = false,
  backHref,
  backLabel = "Go back",
  showBackOnMobile = false,
  rightSlot,
  className,
}: AccountHeroProps) {
  const router = useRouter();

  return (
    <div className={cn("bg-brand py-5 text-white", className)}>
      <Container className="max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {showBackOnMobile && backHref ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white lg:hidden"
                onClick={() => router.push(backHref)}
                aria-label={backLabel}
              >
                <ArrowLeftIcon className="size-4" />
              </Button>
            ) : null}

            {loading ? (
              <Skeleton
                className="size-[60px] shrink-0 rounded-full bg-white/20"
                aria-hidden="true"
              />
            ) : (
              <Image
                src="/avatar.webp"
                alt=""
                width={ACCOUNT_HERO_AVATAR_SIZE}
                height={ACCOUNT_HERO_AVATAR_SIZE}
                className="size-[60px] shrink-0 rounded-full object-cover"
              />
            )}

            <div className="min-w-0 flex-1">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36 rounded-md bg-white/20 sm:h-6 sm:w-44" />
                  <Skeleton className="h-3 w-28 rounded-md bg-white/15" />
                </div>
              ) : (
                <>
                  <h1 className="truncate text-lg font-semibold sm:text-xl">
                    {title}
                  </h1>
                  {subtitle ? (
                    <div className="mt-1 truncate text-xs text-white/80">
                      {subtitle}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {rightSlot ? (
            <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto sm:justify-end">
              {rightSlot}
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
