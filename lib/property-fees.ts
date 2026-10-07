export type PropertyFeeBreakup = {
  gstAmount: number;
  platformFee: number;
  taxesAndFees: number;
};

export const MEMBER_SAVINGS_RATE = 0.15;

type FeeSource = {
  estimatedTaxes?: number | null;
  estimatedGst?: number | null;
  estimatedPlatformFee?: number | null;
};

export function feeBreakupFromSource(source: FeeSource): PropertyFeeBreakup | null {
  if (source.estimatedTaxes == null) return null;
  return {
    gstAmount: source.estimatedGst ?? 0,
    platformFee: source.estimatedPlatformFee ?? 0,
    taxesAndFees: source.estimatedTaxes,
  };
}

export function grandTotalFromSource(source: FeeSource & { totalPrice: number }): number {
  const fees = feeBreakupFromSource(source);
  return source.totalPrice + (fees?.taxesAndFees ?? 0);
}

export function calculateMemberSavingsFromTotal(totalAmount: number): number {
  return Math.round(totalAmount * MEMBER_SAVINGS_RATE);
}
