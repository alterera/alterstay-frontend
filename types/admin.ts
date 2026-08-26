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

export type AdminBooking = {
  id: string;
  reservationNumber: string;
  status: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
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
  items: { roomTypeName: string; ratePlanName: string; quantity: number }[];
  payments: {
    id: string;
    paymentReference: string;
    status: string;
    amount: string | number;
    paidAt: string | null;
    refundRequired: boolean;
  }[];
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
  _count?: { rooms: number; ratePlans: number };
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
  roomType: RoomType;
  mealPlan: MealPlan | null;
  cancellationPolicy: CancellationPolicy | null;
  prices: { id: string; date: string; basePrice: string; currency: string }[];
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
