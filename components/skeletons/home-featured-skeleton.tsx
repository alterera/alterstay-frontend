import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeFeaturedSkeleton() {
  return (
    <section className="bg-background py-8 sm:py-10">
      <Container>
        <Skeleton className="h-8 w-72 max-w-full rounded-md" />
        <Skeleton className="mt-2 h-4 w-56 rounded-md" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="aspect-[4/3] rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
