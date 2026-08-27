export type QuoteResponse = {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  nights: number;
  rooms: number;
  available: boolean;
  remainingRooms: number;
  expiresAt: string;
};

export type BookingIntentResponse = {
  quoteToken: string;
  expiresAt: string;
  quote: QuoteResponse;
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
};
