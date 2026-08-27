import { Suspense } from "react";

import { BookingLoginGatePage } from "@/components/booking/booking-login-gate-page";

type CheckoutLoginRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CheckoutLoginRoutePage({
  params,
}: CheckoutLoginRoutePageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <BookingLoginGatePage slug={slug} />
    </Suspense>
  );
}
