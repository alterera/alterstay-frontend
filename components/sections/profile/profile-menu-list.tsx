"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import type { ProfileMenuGroup, ProfileMenuItem } from "@/config/profile";
import { cn } from "@/lib/utils";

type ProfileMenuListProps = {
  groups: readonly ProfileMenuGroup[];
  className?: string;
  onAction?: (item: ProfileMenuItem) => void;
};

export function ProfileMenuList({
  groups,
  className,
  onAction,
}: ProfileMenuListProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group) => (
        <section key={group.id}>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </h2>
          <ul className="overflow-hidden rounded-2xl border border-border/70 bg-background">
            {group.items.map((item, index) => {
              const Icon = item.icon;
              const isDanger = item.tone === "danger";
              const rowClass = cn(
                "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/50",
                index > 0 && "border-t border-border/60",
                isDanger && "text-destructive hover:bg-destructive/5",
              );

              const content = (
                <>
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full bg-muted text-foreground",
                      isDanger && "bg-destructive/10 text-destructive",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-sm font-medium text-foreground",
                      isDanger && "text-destructive",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.action ? null : (
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  )}
                </>
              );

              return (
                <li key={item.id}>
                  {item.action ? (
                    <button
                      type="button"
                      className={rowClass}
                      onClick={() => onAction?.(item)}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link href={item.href ?? "#"} className={rowClass}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
