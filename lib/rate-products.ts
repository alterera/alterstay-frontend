export type RateProductCode =
  | "EP_REFUNDABLE"
  | "EP_NON_REFUNDABLE"
  | "CP_REFUNDABLE"
  | "CP_NON_REFUNDABLE"
  | "HB_REFUNDABLE"
  | "HB_NON_REFUNDABLE"
  | "FB_REFUNDABLE"
  | "FB_NON_REFUNDABLE";

export const REQUIRED_PRODUCT_CODE: RateProductCode = "EP_REFUNDABLE";

export const RATE_PRODUCT_CATALOG: {
  code: RateProductCode;
  guestLabel: string;
  required?: boolean;
}[] = [
  {
    code: "EP_REFUNDABLE",
    guestLabel: "Room only · Free cancellation",
    required: true,
  },
  {
    code: "EP_NON_REFUNDABLE",
    guestLabel: "Room only · Non-refundable",
  },
  {
    code: "CP_REFUNDABLE",
    guestLabel: "Breakfast included · Free cancellation",
  },
  {
    code: "CP_NON_REFUNDABLE",
    guestLabel: "Breakfast included · Non-refundable",
  },
  {
    code: "HB_REFUNDABLE",
    guestLabel: "Breakfast + Dinner · Free cancellation",
  },
  {
    code: "HB_NON_REFUNDABLE",
    guestLabel: "Breakfast + Dinner · Non-refundable",
  },
  {
    code: "FB_REFUNDABLE",
    guestLabel: "All meals · Free cancellation",
  },
  {
    code: "FB_NON_REFUNDABLE",
    guestLabel: "All meals · Non-refundable",
  },
];

const GUEST_LABELS = Object.fromEntries(
  RATE_PRODUCT_CATALOG.map((p) => [p.code, p.guestLabel]),
) as Record<RateProductCode, string>;

export function getProductGuestLabel(
  productCode: string | null | undefined,
  fallback = "Rate plan",
): string {
  if (!productCode) return fallback;
  return GUEST_LABELS[productCode as RateProductCode] ?? fallback;
}
