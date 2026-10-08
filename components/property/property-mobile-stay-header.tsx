"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, HomeIcon, UsersIcon } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { formatPropertyHeaderDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PropertySearchParams } from "@/types/search";

import { PropertyStayEditSheet } from "./property-stay-edit-sheet";

type PropertyMobileStayHeaderProps = {
  search: PropertySearchParams;
  onSearchUpdate: (search: PropertySearchParams) => void;
  className?: string;
  /** Room selection uses back; property page uses home. */
  leadAction?: "home" | "back";
  onBack?: () => void;
};

const chipClass =
  "rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white transition-colors hover:bg-white/25";

export function PropertyMobileStayHeader({
  search,
  onSearchUpdate,
  className,
  leadAction = "home",
  onBack,
}: PropertyMobileStayHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const guestCount = search.guests.adults + search.guests.children;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-brand pt-[env(safe-area-inset-top)] lg:hidden",
          className,
        )}
      >
        <div className="flex h-11 items-center gap-2 px-3">
          {leadAction === "back" ? (
            <button
              type="button"
              aria-label="Go back"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white"
              onClick={onBack}
            >
              <ArrowLeftIcon className="size-5" />
            </button>
          ) : (
            <Link
              href={ROUTES.home}
              aria-label="Go to home"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-white"
            >
              <HomeIcon className="size-5" />
            </Link>
          )}

          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className={cn(chipClass, "truncate")}
            >
              {formatPropertyHeaderDate(search.dateRange.from)}
            </button>
            <span className="shrink-0 text-[11px] font-medium text-white/80">→</span>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className={cn(chipClass, "truncate")}
            >
              {formatPropertyHeaderDate(search.dateRange.to)}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className={cn(chipClass, "inline-flex shrink-0 items-center gap-1")}
            aria-label={`${guestCount} guests. Edit occupancy`}
          >
            <UsersIcon className="size-3.5" />
            <span>{guestCount}</span>
          </button>
        </div>
      </header>

      <PropertyStayEditSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        search={search}
        onUpdate={onSearchUpdate}
      />
    </>
  );
}
