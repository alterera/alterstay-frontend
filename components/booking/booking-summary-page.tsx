"use client";

import { CheckoutPage } from "@/components/booking/checkout-page";

type BookingSummaryPageProps = {
  slug: string;
};

/** @deprecated Use CheckoutPage — kept for any stale imports during migration. */
export function BookingSummaryPage({ slug }: BookingSummaryPageProps) {
  return <CheckoutPage slug={slug} />;
}
