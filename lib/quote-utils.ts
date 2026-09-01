import type { BookingBill } from "@/lib/booking-url";
import type { QuoteResponse } from "@/types/quote";

export function quoteToBill(quote: QuoteResponse): BookingBill {
  const coinsApplied = quote.coinsRedeemed ?? 0;
  return {
    roomPrice: quote.subtotal,
    discount: 0,
    coinsApplied,
    tax: quote.taxAmount,
    toPay: quote.totalAmount,
    currency: quote.currency,
    coinEarnPreview: quote.coinEarnPreview,
  };
}
