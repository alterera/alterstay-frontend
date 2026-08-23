import { Suspense } from "react";

import { BookingPaymentResultPage } from "@/components/booking/booking-payment-result-page";

export default function BookingPaymentResultRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading payment status…
        </div>
      }
    >
      <BookingPaymentResultPage />
    </Suspense>
  );
}
