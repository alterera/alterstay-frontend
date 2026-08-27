import type { BookingBill } from "@/lib/booking-url";
import type { QuoteResponse } from "@/types/quote";

export function quoteToBill(quote: QuoteResponse): BookingBill {
  return {
    roomPrice: quote.subtotal,
    tax: quote.taxAmount,
    toPay: quote.totalAmount,
    currency: quote.currency,
  };
}
