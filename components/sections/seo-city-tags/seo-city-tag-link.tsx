import Link from "next/link";

import type { SeoCityTag } from "@/config/seo-city-tags";
import { cn } from "@/lib/utils";

type SeoCityTagLinkProps = {
  tag: SeoCityTag;
  className?: string;
};

export function SeoCityTagLink({ tag, className }: SeoCityTagLinkProps) {
  return (
    <Link
      href={tag.href}
      className={cn(
        "text-[11px] leading-relaxed text-muted-foreground/70 transition-colors hover:text-muted-foreground sm:text-xs",
        className
      )}
    >
      {tag.label}
    </Link>
  );
}
