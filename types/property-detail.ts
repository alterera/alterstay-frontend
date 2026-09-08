import type { SearchPropertyType } from "@/types/search-results";

export type PropertyAddressDetail = {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type PropertyAmenityDetail = {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
};

export type PropertyPolicyDetail = {
  id: string;
  policyType: string;
  title: string;
  description: string | null;
};

export type PropertyRestrictionDetail = {
  id: string;
  label: string;
  icon: string | null;
};

export type PropertyReviewBreakdown = {
  smoothCheckIn: number;
  roomQuality: number;
  staffBehavior: number;
  hotelSurroundings: number;
};

export type PropertyReviewSummary = {
  guestRating: number | null;
  reviewCount: number;
  breakdown: PropertyReviewBreakdown;
};

export type PropertyGuestReviewDetail = {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  date: string;
  comment: string;
  breakdown: PropertyReviewBreakdown;
};

export type PropertyRatingBreakdown = PropertyReviewBreakdown;
export type PropertyGuestReview = PropertyGuestReviewDetail;
export type PropertyRestriction = PropertyRestrictionDetail;

export type PropertyRatePlanDetail = {
  id: string;
  name: string;
  description: string | null;
  mealPlan: { code: string; name: string } | null;
  cancellationPolicy: { name: string; description: string } | null;
  totalPrice: number | null;
  pricePerNight: number | null;
  estimatedTaxes: number | null;
  currency: string;
};

export type PropertyRoomTypeDetail = {
  id: string;
  name: string;
  description: string | null;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  bedType: string | null;
  sizeSqm: number | null;
  imageUrls: string[];
  amenities: string[];
  ratePlans: PropertyRatePlanDetail[];
  minPricePerNight: number | null;
};

export type PropertyDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  starRating: number | null;
  guestRating: number | null;
  isBusinessHotel: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  propertyType: SearchPropertyType;
  city?: string;
  area?: string;
  state?: string;
  country?: string;
  address: PropertyAddressDetail | null;
  imageUrls: string[];
  tags: { code: string; name: string }[];
  amenities: PropertyAmenityDetail[];
  policies: PropertyPolicyDetail[];
  restrictions: PropertyRestrictionDetail[];
  reviewSummary: PropertyReviewSummary;
  reviews: PropertyGuestReviewDetail[];
  roomTypes: PropertyRoomTypeDetail[];
  minTotalPrice: number | null;
  minPricePerNight: number | null;
  estimatedTaxes: number | null;
  currency: string;
  nights: number;
};

export const PROPERTY_SECTIONS = [
  { id: "info", label: "Info" },
  { id: "facilities", label: "Facilities" },
  { id: "location", label: "Location" },
  { id: "ratings", label: "Ratings" },
  { id: "policies", label: "Policies" },
  { id: "room-options", label: "Room Options" },
] as const;

export type PropertySectionId = (typeof PROPERTY_SECTIONS)[number]["id"];

export type SelectedRoomPlan = {
  roomTypeId: string;
  roomTypeName: string;
  ratePlanId: string;
  ratePlanName: string;
  pricePerNight: number;
  totalPrice: number;
  estimatedTaxes: number | null;
  currency: string;
};
