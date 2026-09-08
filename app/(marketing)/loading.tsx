import { HomeFeaturedSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  return (
    <div className="space-y-0">
      <div className="bg-gradient-hero px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-4 text-center">
          <Skeleton className="mx-auto h-8 w-48 rounded-md bg-white/20" />
          <Skeleton className="mx-auto h-12 w-full max-w-xl rounded-md bg-white/20" />
          <Skeleton className="mx-auto h-14 w-full max-w-2xl rounded-xl bg-white/30" />
        </div>
      </div>
      <HomeFeaturedSkeleton />
    </div>
  );
}
