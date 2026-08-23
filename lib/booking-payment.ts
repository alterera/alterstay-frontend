import { createPaymentSession } from "@/lib/booking-api";
import { openCashfreeCheckout } from "@/lib/cashfree-checkout";

export async function retryPaymentForBooking(reference: string): Promise<void> {
  const session = await createPaymentSession(reference);
  await openCashfreeCheckout(session);
}
