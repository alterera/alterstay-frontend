import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingsListSkeleton() {
  return (
    <Container>
      <Skeleton className="mb-5 h-8 w-40 rounded-md" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24 rounded-md" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-2xl" />
        ))}
      </div>
    </Container>
  );
}
