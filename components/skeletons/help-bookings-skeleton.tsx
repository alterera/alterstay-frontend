import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function HelpBookingsSkeleton() {
  return (
    <section className="bg-background pb-12 pt-4 sm:pt-8">
      <Container className="max-w-lg">
        <Skeleton className="h-7 w-28 rounded-md" />
        <div className="mt-8 flex flex-col items-center">
          <Skeleton className="size-14 rounded-full" />
          <Skeleton className="mt-4 h-3 w-44 rounded-md" />
          <Skeleton className="mt-2 h-8 w-72 max-w-full rounded-md" />
        </div>
        <div className="mt-8 space-y-8">
          {["Completed", "Cancelled"].map((label) => (
            <div key={label} className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
        <Skeleton className="mt-10 h-44 rounded-2xl" />
      </Container>
    </section>
  );
}
