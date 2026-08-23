"use client";

import { CountUp } from "@/components/ui/count-up";
import type { MilestoneStat } from "@/config/milestones";
import { cn } from "@/lib/utils";

type MilestoneStatCardProps = {
  stat: MilestoneStat;
  className?: string;
};

export function MilestoneStatCard({
  stat,
  className,
}: MilestoneStatCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-48 flex-col justify-between rounded-2xl bg-secondary p-5 sm:min-h-52 sm:p-6 lg:min-h-56",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">{stat.label}</p>

      <div className="space-y-1">
        <p className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          <CountUp
            from={0}
            to={stat.value}
            duration={stat.duration ?? 1.5}
            delay={stat.delay ?? 0}
            className="tabular-nums"
          />
          {stat.suffix ? (
            <span className="text-brand">{stat.suffix}</span>
          ) : null}
        </p>
        <p className="text-base text-foreground/80">{stat.description}</p>
      </div>
    </article>
  );
}
