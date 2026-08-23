const KNOWN_MESSAGES: Record<string, string> = {
  CARD_DECLINED: "Your card was declined. Please try another payment method.",
  PROVIDER_REPORTED_FAILURE:
    "Payment could not be completed. Please try again.",
  SESSION_ABORTED_INELIGIBLE:
    "This checkout session expired. Please try payment again.",
};

export function toCustomerPaymentFailureMessage(
  failureReason?: string | null,
): string {
  if (!failureReason) {
    return "Payment could not be completed. Please try again.";
  }
  return (
    KNOWN_MESSAGES[failureReason] ??
    "Payment could not be completed. Please try again."
  );
}
