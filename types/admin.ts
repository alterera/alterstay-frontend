export type PropertyType = {
  id: string;
  code: string;
  name: string;
  description: string | null;
};

export type Amenity = {
  id: string;
  name: string;
  category: string | null;
  icon?: string | null;
};

export type AdminCity = {
  id: string;
  name: string;
  slug: string;
  state: string | null;
  country: string;
  areas: AdminArea[];
};

export type AdminArea = {
  id: string;
  name: string;
  slug: string;
  cityId?: string;
};

export type AdminBookingPayment = {
  id: string;
  paymentReference: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  paidAt: string | null;
  refundRequired: boolean;
  refundReason: string | null;
  failureReason: string | null;
  refunds: {
    id: string;
    amount: number;
    reason: string | null;
    status: string;
    providerRefundId: string | null;
    createdAt: string;
    processedAt: string | null;
  }[];
};

export type AdminBookingStatusHistory = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  actor: string;
  metadata: unknown;
  createdAt: string;
};

export type AdminBooking = {
  id: string;
  reservationNumber: string;
  status: string;
  checkIn: string;
  checkOut: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  coinsRedeemed: number;
  coinsEarnable: number;
  coinsEarnedAt: string | null;
  companyName: string | null;
  gstin: string | null;
  billingAddress: string | null;
  createdAt: string;
  updatedAt: string;
  holdExpiresAt: string | null;
  confirmedAt: string | null;
  property: { id: string; name: string; slug: string };
  user: {
    id: string;
    phone: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  guest: {
    firstName: string;
    lastName: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  items: {
    id: string;
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
  }[];
  payments: AdminBookingPayment[];
  statusHistory?: AdminBookingStatusHistory[];
};

export type PropertyAddress = {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
};

export type PropertyImage = {
  id: string;
  url: string;
  type: string;
  sortOrder: number;
};

export type PropertyPolicy = {
  id: string;
  policyType: string;
  title: string;
  description: string | null;
};

export type PropertyListItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  starRating: number | null;
  propertyType: PropertyType;
  addresses: PropertyAddress[];
  images?: PropertyImage[];
};

export type Property = PropertyListItem & {
  images: PropertyImage[];
  description: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  amenities: { amenity: Amenity }[];
  policies: PropertyPolicy[];
};

export type RoomType = {
  id: string;
  name: string;
  description: string | null;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  bedType: string | null;
  sizeSqm: string | null;
  status: string;
  _count?: { ratePlans: number; reservationItems?: number; rooms?: number };
};

export type Room = {
  id: string;
  roomNumber: string;
  floor: string | null;
  status: string;
  roomType: RoomType;
};

export type RoomInventory = {
  id: string;
  date: string;
  totalRooms: number;
  blockedRooms: number;
  soldRooms: number;
  roomType: RoomType;
};

export type MealPlan = {
  id: string;
  code: string;
  name: string;
};

export type CancellationPolicy = {
  id: string;
  name: string;
  description: string;
};

export type RatePlan = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  roomType: RoomType;
  mealPlan: MealPlan | null;
  cancellationPolicy: CancellationPolicy | null;
  _count?: { reservationItems: number; prices: number };
  prices?: RatePrice[];
};

export type RatePrice = {
  id: string;
  date: string;
  basePrice: string;
  currency: string;
};

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  imageUrl: string | null;
  minTotalPrice: number | null;
  currency: string;
  nights: number;
};
