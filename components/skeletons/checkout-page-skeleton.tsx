import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutPageSkeleton() {
  return (
    <div className="bg-muted/20 pb-28 pt-6 lg:pb-10">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-7 w-32 rounded-md" />
            </div>
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <Skeleton className="hidden h-80 rounded-2xl lg:block" />
        </div>
      </Container>
    </div>
  );
}
