import type {
  PropertyDetail,
  PropertyGuestReview,
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
      perks: perksFromCategory,
      amenities: amenitiesFromCategory,
    };
  }

  const perks = property.amenities.filter((a) => isPerkName(a.name));
  const amenities = property.amenities.filter((a) => !isPerkName(a.name));

  if (perks.length === 0 && property.tags.length > 0) {
    return {
      perks: property.tags.slice(0, 4).map((t) => ({
        id: t.code,
        name: t.name,
        category: "PERK",
        icon: null,
      })),
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

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Average";
  return "Below Average";
}

export function getMockReviewCount(guestRating: number | null): number {
  const base = guestRating ?? 4;
  return Math.round(380 + base * 48);
}

const MOCK_REVIEWS: Omit<PropertyGuestReview, "id" | "rating">[] = [
  {
    authorName: "Priya Sharma",
    authorInitials: "PS",
    date: "2026-07-14",
    comment:
      "Smooth check-in and a spotless room. Staff were attentive without being intrusive — exactly what we wanted for a weekend getaway.",
  },
  {
    authorName: "Rahul Mehta",
    authorInitials: "RM",
    date: "2026-06-28",
    comment:
      "Great location and comfortable beds. Breakfast spread was better than expected. Would happily book again for business trips.",
  },
  {
    authorName: "Ananya Iyer",
    authorInitials: "AI",
    date: "2026-06-02",
    comment:
      "Loved the ambience and the view from our room. Housekeeping was prompt and the front desk helped us with early luggage storage.",
  },
  {
    authorName: "Vikram Singh",
    authorInitials: "VS",
    date: "2026-05-19",
    comment:
      "Solid value for money. Room was quiet, Wi‑Fi was reliable, and checkout was quick. Minor wait at the restaurant during peak hours.",
  },
];

export function buildGuestReviews(
  guestRating: number | null,
): PropertyGuestReview[] {
  const base = guestRating ?? 4;
  return MOCK_REVIEWS.map((review, index) => ({
    ...review,
    id: `review-${index + 1}`,
    rating: clampRating(base + (index % 2 === 0 ? 0.1 : -0.2)),
  }));
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
