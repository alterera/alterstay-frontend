import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function CitiesPageSkeleton() {
  return (
    <section className="bg-background pb-12 pt-6">
      <Container>
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="mt-4 h-9 w-56 rounded-md" />
        <Skeleton className="mt-2 h-4 w-72 rounded-md" />
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded-md" />
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
      </Container>
    </section>
  );
}
