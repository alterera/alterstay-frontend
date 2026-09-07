"use client";

import Link from "next/link";

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
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </h2>
          <ul className="overflow-hidden">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isDanger = item.tone === "danger";
              const rowClass = cn(
                "flex w-full items-center gap-2 text-left",
                isDanger && "text-destructive",
              );

              const content = (
                <>
                  <span
                    className={cn(
                      "flex items-center justify-center"
                    )}
                  >
                    <Icon className="size-4" color="gray" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-sm text-foreground",
                      isDanger && "text-destructive",
                    )}
                  >
                    {item.label}
                  </span>
                </>
              );

              return (
                <li key={item.id}>
                  {item.action ? (
                    <button
                      type="button"
                      className={cn(rowClass, "py-2")}
                      onClick={() => onAction?.(item)}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link
                      href={item.href ?? "#"}
                      className={cn(rowClass, "py-2")}
                    >
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
