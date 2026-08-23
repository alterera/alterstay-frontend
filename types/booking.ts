export type BookingStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "EXPIRED"
  | "COMPLETED"
  | "NO_SHOW";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type BookingGuestInput = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type BusinessBookingInput = {
  companyName: string;
  gstin: string;
  billingAddress: string;
};

export type CreateBookingRequest = {
  propertySlug: string;
  roomTypeId: string;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  guest: BookingGuestInput;
  businessBooking?: BusinessBookingInput;
};

export type PaymentSummary = {
  status: PaymentStatus;
  paymentReference: string;
  paidAt: string | null;
  refundRequired: boolean;
  failureReason: string | null;
};

export type BookingGuest = BookingGuestInput & {
  lastName: string | null;
};

export type BookingItem = {
  roomTypeId: string;
  ratePlanId: string;
  roomTypeName: string;
  ratePlanName: string;
  mealPlanName: string | null;
  cancellationPolicyText: string | null;
  quantity: number;
  checkIn: string;
  checkOut: string;
  unitPrice: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  snapshot: unknown;
};

export type BookingResponse = {
  reservationNumber: string;
  status: BookingStatus;
  property: {
    name: string;
    slug: string;
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  holdExpiresAt: string | null;
  confirmedAt: string | null;
  createdAt: string;
  payment: PaymentSummary | null;
  businessBooking: BusinessBookingInput | null;
  guests: BookingGuest[];
  items: BookingItem[];
};

export type PaymentSessionResponse = {
  paymentReference: string;
  /** Present after the hotel backend started forwarding the pay-service session. */
  paymentSessionId?: string;
  checkoutUrl: string;
  cashfreeMode?: "production" | "sandbox";
  sessionExpiresAt: string | null;
  amount: string;
  currency: string;
  holdExpiresAt: string | null;
};
