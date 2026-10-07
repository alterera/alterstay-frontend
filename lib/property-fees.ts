export const PLATFORM_FEE_AMOUNT = 262;
export const GST_RATE = 0.18;
export const MEMBER_SAVINGS_RATE = 0.15;

export type PropertyFeeBreakup = {
  gstAmount: number;
  platformFee: number;
  taxesAndFees: number;
};

export function calculatePropertyFeeBreakup(
  roomTotal: number,
): PropertyFeeBreakup {
  const gstAmount = Math.round(roomTotal * GST_RATE);
  const platformFee = PLATFORM_FEE_AMOUNT;
  return {
    gstAmount,
    platformFee,
    taxesAndFees: gstAmount + platformFee,
  };
}

export function calculatePropertyGrandTotal(roomTotal: number): number {
  const { taxesAndFees } = calculatePropertyFeeBreakup(roomTotal);
  return roomTotal + taxesAndFees;
}

export function calculateMemberSavings(roomTotal: number): number {
  const grandTotal = calculatePropertyGrandTotal(roomTotal);
  return Math.round(grandTotal * MEMBER_SAVINGS_RATE);
}
