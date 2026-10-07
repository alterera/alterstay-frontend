export type CoinEarnPreview = {
  planCode: string;
  earnPercent: number;
  earnableAmount: number;
};

export type QuoteNightlyRate = {
  date: string;
  barPrice: number;
  finalPrice: number;
  adjustments: {
    code: string;
    label: string;
    multiplier?: number;
    amountDelta?: number;
  }[];
};

export type QuoteResponse = {
  subtotal: number;
  gstAmount: number;
  platformFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  nights: number;
  rooms: number;
  available: boolean;
  remainingRooms: number;
  expiresAt: string;
  nightly?: QuoteNightlyRate[];
  coinEarnPreview?: CoinEarnPreview;
  coinsRedeemed?: number;
  /** @deprecated No checkout discount — use coinEarnPreview. */
  membershipDiscount?: {
    planCode: string;
    discountPercent: number;
    discountableAmount: number;
    discountAmount: number;
  };
};

export type BookingIntentResponse = {
  quoteToken: string;
  expiresAt: string;
  quote: QuoteResponse;
  coinsBalance?: number;
  maxCoinsRedeemable?: number;
  property: { name: string; slug: string };
  roomType: { id: string; name: string };
  ratePlan: { id: string; name: string };
};

export type QuoteSelectionInput = {
  propertySlug: string;
  roomTypeId: string;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  coinsToRedeem?: number;
};
