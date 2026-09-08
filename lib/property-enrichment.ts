import type {
  PropertyDetail,
  PropertyAmenityDetail,
} from "@/types/property-detail";

export function splitAmenities(property: PropertyDetail) {
  const perks = property.amenities.filter(
    (a) => a.category?.toUpperCase() === "PERK",
  );
  const amenities = property.amenities.filter(
    (a) => a.category?.toUpperCase() !== "PERK",
  );

  return { perks, amenities };
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Average";
  return "Below Average";
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

export type { PropertyAmenityDetail };
