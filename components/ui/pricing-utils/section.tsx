import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section">;

export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "w-full bg-background px-4 py-12 sm:px-6 sm:py-16 lg:py-20",
        className,
      )}
      {...props}
    />
  );
}
