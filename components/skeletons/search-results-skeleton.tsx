import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultsSkeleton() {
  return (
    <div className="bg-background pb-12">
      <div className="hidden border-b bg-background px-4 py-4 lg:block">
        <Container>
          <Skeleton className="h-12 w-full max-w-4xl rounded-xl" />
        </Container>
      </div>
      <Container className="mt-4 lg:mt-6">
        <div className="flex gap-6">
          <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </aside>
          <div className="min-w-0 flex-1 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg lg:hidden" />
            <Skeleton className="h-5 w-40 rounded-md" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl border bg-white p-3 sm:p-4"
              >
                <Skeleton className="size-28 shrink-0 rounded-lg sm:size-36" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="mt-2 h-6 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
