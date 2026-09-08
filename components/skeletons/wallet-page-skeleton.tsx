import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function WalletPageSkeleton() {
  return (
    <Container className="max-w-6xl py-4 sm:py-10">
      <div className="mb-4 flex items-center gap-3 lg:hidden">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-md" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="hidden h-72 rounded-xl lg:block" />
      </div>
    </Container>
  );
}
