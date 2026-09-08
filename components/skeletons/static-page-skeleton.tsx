import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function StaticPageSkeleton() {
  return (
    <>
      <div className="border-b bg-background px-4 py-3 sm:px-6">
        <div className="mx-auto flex h-8 max-w-3xl items-center gap-3">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>
      </div>
      <section className="bg-background pb-16 pt-8">
        <Container className="max-w-3xl">
          <Skeleton className="h-10 w-2/3 rounded-md" />
          <Skeleton className="mt-4 h-20 w-full rounded-xl" />
          <div className="mt-8 space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
