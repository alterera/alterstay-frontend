"use client";

import { useState } from "react";

import { seoCityTagsConfig } from "@/config/seo-city-tags";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SeoCityTagLink } from "./seo-city-tag-link";

type SeoCityTagsSectionProps = {
  className?: string;
};

function SeoCityTagList({
  tags,
}: {
  tags: (typeof seoCityTagsConfig.tags)[number][];
}) {
  return (
    <p className="text-[11px] leading-relaxed text-muted-foreground/70 sm:text-xs">
      {tags.map((tag, index) => (
        <span key={tag.id}>
          {index > 0 ? (
            <span className="mx-1.5 text-muted-foreground/40" aria-hidden="true">
              |
            </span>
          ) : null}
          <SeoCityTagLink tag={tag} />
        </span>
      ))}
    </p>
  );
}

export function SeoCityTagsSection({ className }: SeoCityTagsSectionProps) {
  const { title, tags, mobileInitialCount } = seoCityTagsConfig;
  const [expanded, setExpanded] = useState(false);

  const hasMoreOnMobile = tags.length > mobileInitialCount;
  const mobileTags = expanded ? tags : tags.slice(0, mobileInitialCount);

  return (
    <section className={cn("py-0", className)}>
      <Container>
        <h2 className="mb-3 text-xs font-medium tracking-tight text-muted-foreground sm:mb-4 sm:text-sm">
          {title}
        </h2>

        {/* Mobile: collapsed list with load more */}
        <div className="flex flex-col gap-3 lg:hidden">
          <SeoCityTagList tags={[...mobileTags]} />

          {hasMoreOnMobile ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setExpanded((current) => !current)}
              className="h-auto w-fit px-0 text-xs text-muted-foreground underline-offset-2"
            >
              {expanded ? "Show less" : "Load more"}
            </Button>
          ) : null}
        </div>

        {/* Desktop: show all tags */}
        <div className="hidden lg:block">
          <SeoCityTagList tags={[...tags]} />
        </div>
      </Container>
    </section>
  );
}
