import type {
  PropertyDetail,
  PropertyRatingBreakdown,
  PropertyRestriction,
} from "@/types/property-detail";

const DEFAULT_RESTRICTIONS: PropertyRestriction[] = [
  { id: "alcohol-smoking", label: "Alcohol/Smoking Not Allowed" },
  { id: "pets", label: "Pets Not Allowed" },
  { id: "outside-food", label: "Outside Food Allowed" },
];

const PERK_KEYWORDS = [
  "restaurant",
  "spa",
  "massage",
  "bar",
  "lounge",
  "pool",
  "gym",
  "fitness",
];

function isPerkName(name: string): boolean {
  const lower = name.toLowerCase();
  return PERK_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export function splitAmenities(property: PropertyDetail) {
  const perksFromCategory = property.amenities.filter(
    (a) => a.category?.toUpperCase() === "PERK",
  );
  const amenitiesFromCategory = property.amenities.filter(
    (a) => a.category?.toUpperCase() !== "PERK",
  );

  if (perksFromCategory.length > 0) {
    return {
      perks: perksFromCategory.map((a) => a.name),
      amenities: amenitiesFromCategory.map((a) => a.name),
    };
  }

  const perks = property.amenities
    .filter((a) => isPerkName(a.name))
    .map((a) => a.name);
  const amenities = property.amenities
    .filter((a) => !isPerkName(a.name))
    .map((a) => a.name);

  if (perks.length === 0 && property.tags.length > 0) {
    return {
      perks: property.tags.slice(0, 4).map((t) => t.name),
      amenities,
    };
  }

  return { perks, amenities };
}

export function buildRatingBreakdown(
  guestRating: number | null,
): PropertyRatingBreakdown {
  const base = guestRating ?? 4;
  return {
    smoothCheckIn: clampRating(base + 0.2),
    roomQuality: clampRating(base - 0.1),
    staffBehavior: clampRating(base + 0.4),
    hotelSurroundings: clampRating(base - 0.3),
  };
}

export function getPropertyRestrictions(): PropertyRestriction[] {
  return DEFAULT_RESTRICTIONS;
}

function clampRating(value: number): number {
  return Math.min(5, Math.max(1, Math.round(value * 10) / 10));
}

export function formatFullAddress(property: PropertyDetail): string {
  const address = property.address;
  if (!address) {
    return [property.area, property.city, property.state, property.country]
      .filter(Boolean)
      .join(", ");
  }

  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getDirectionsUrl(property: PropertyDetail): string {
  const { latitude, longitude } = property.address ?? {};
  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }

  const query = encodeURIComponent(formatFullAddress(property));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getMapEmbedUrl(property: PropertyDetail): string | null {
  const { latitude, longitude } = property.address ?? {};
  if (latitude == null || longitude == null) return null;
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}
