import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function LegalPageSkeleton() {
  return (
    <section className="bg-background pb-16 pt-6">
      <Container className="max-w-3xl">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="mt-3 h-10 w-3/4 max-w-md rounded-md" />
        <Skeleton className="mt-3 h-4 w-40 rounded-md" />
        <Skeleton className="mt-6 h-20 w-full rounded-xl" />
        <div className="mt-10 space-y-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
