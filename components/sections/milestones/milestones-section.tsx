import { Container } from "@/components/common/container";
import { milestonesConfig } from "@/config/milestones";
import { cn } from "@/lib/utils";

import { MilestoneStatCard } from "./milestone-stat-card";

type MilestonesSectionProps = {
  className?: string;
};

export function MilestonesSection({ className }: MilestonesSectionProps) {
  const { title, subtitle, stats } = milestonesConfig;

  return (
    <section className={cn("bg-background py-12 sm:py-16 lg:py-20", className)}>
      <Container>
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {stats.map((stat) => (
            <MilestoneStatCard
              key={stat.id}
              stat={stat}
              className="sm:last:col-span-2 lg:last:col-span-1"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
