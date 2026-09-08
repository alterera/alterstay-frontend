import { BookingsListSkeleton } from "@/components/skeletons";

export default function BookingsLoading() {
  return (
    <section className="bg-background pb-8 pt-6 lg:pt-10">
      <BookingsListSkeleton />
    </section>
  );
}
