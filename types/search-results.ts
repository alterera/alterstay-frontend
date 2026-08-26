export type SortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating_asc"
  | "rating_desc";

export type SearchFilters = {
  areaIds: string[];
  priceBuckets: string[];
  minRating: number | null;
  propertyTypeIds: string[];
  businessHotels: boolean;
  sortBy: SortOption;
};

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  areaIds: [],
  priceBuckets: [],
  minRating: null,
  propertyTypeIds: [],
  businessHotels: false,
  sortBy: "recommended",
};

export type SearchArea = {
  id: string;
  name: string;
  slug: string;
};

export type SearchPropertyType = {
  id: string;
  code: string;
  name: string;
};

export type PropertySearchResult = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  starRating: number | null;
  guestRating: number | null;
  isBusinessHotel: boolean;
  propertyType: SearchPropertyType;
  city?: string;
  area?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  imageUrls: string[];
  tags: { code: string; name: string }[];
  amenities: string[];
  remainingRooms?: number | null;
  reviewCount?: number;
  minTotalPrice: number | null;
  minPricePerNight: number | null;
  estimatedTaxes: number | null;
  currency: string;
  nights: number;
  availableRoomTypeCount: number;
  hasSingleRoomType: boolean;
};

export type SearchPropertiesResponse = {
  results: PropertySearchResult[];
  count: number;
};

export const PRICE_FILTER_OPTIONS = [
  { id: "500-1000", label: "₹500 - ₹1000" },
  { id: "1000-1500", label: "₹1000 - ₹1500" },
  { id: "1500-3000", label: "₹1500 - ₹3000" },
  { id: "3000-4500", label: "₹3000 - ₹4500" },
  { id: "4500-7000", label: "₹4500 - ₹7000" },
  { id: "7000+", label: "₹7000+" },
] as const;

export const RATING_FILTER_OPTIONS = [
  { value: 3.0, label: "3.0+" },
  { value: 3.5, label: "3.5+" },
  { value: 4.0, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
] as const;
