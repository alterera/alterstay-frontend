import { Suspense } from "react";

import { BookingSummaryPage } from "@/components/booking/booking-summary-page";

type BookingRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BookingRoutePage({
  params,
}: BookingRoutePageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading booking summary…
        </div>
      }
    >
      <BookingSummaryPage slug={slug} />
    </Suspense>
  );
}
