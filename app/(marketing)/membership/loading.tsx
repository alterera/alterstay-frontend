import { MembershipPlansSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/common/container";

export default function MembershipLoading() {
  return (
    <div>
      <div className="bg-brand px-4 py-8">
        <Container className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full bg-white/20" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 rounded-md bg-white/20" />
            <Skeleton className="h-4 w-56 rounded-md bg-white/20" />
          </div>
        </Container>
      </div>
      <Container className="mt-6 max-w-4xl space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </Container>
    </div>
  );
}
