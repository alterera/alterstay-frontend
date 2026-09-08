import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyPageSkeleton() {
  return (
    <div className="bg-muted/20 pb-24 lg:pb-12">
      <Container className="space-y-6 py-6">
        <Skeleton className="hidden h-4 w-64 rounded-md lg:block" />
        <div className="grid gap-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-3">
          <Skeleton className="aspect-[16/10] rounded-xl lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[360px]" />
          <Skeleton className="hidden aspect-[4/3] rounded-xl lg:block" />
          <Skeleton className="hidden aspect-[4/3] rounded-xl lg:block" />
          <Skeleton className="hidden aspect-[4/3] rounded-xl lg:block" />
          <Skeleton className="hidden aspect-[4/3] rounded-xl lg:block" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Skeleton className="h-8 w-2/3 rounded-md" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <Skeleton className="hidden h-80 rounded-xl lg:block" />
        </div>
      </Container>
    </div>
  );
}
