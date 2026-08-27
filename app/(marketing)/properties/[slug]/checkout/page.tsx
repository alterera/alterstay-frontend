import { Suspense } from "react";

import { CheckoutPage } from "@/components/booking/checkout-page";

type CheckoutRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CheckoutRoutePage({
  params,
}: CheckoutRoutePageProps) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          Loading checkout…
        </div>
      }
    >
      <CheckoutPage slug={slug} />
    </Suspense>
  );
}
