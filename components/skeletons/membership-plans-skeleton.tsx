import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function MembershipPlansSkeleton() {
  return (
    <section className="bg-background py-12 sm:py-16">
      <Container>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-5 w-96 max-w-full rounded-md" />
          <div className="grid w-full max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-2xl border bg-white p-6 sm:p-8">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="mt-3 h-4 w-full rounded-md" />
                <Skeleton className="mt-6 h-10 w-28 rounded-md" />
                <Skeleton className="mt-6 h-11 w-full rounded-xl" />
                <div className="mt-8 space-y-3">
                  {Array.from({ length: 4 }).map((__, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
