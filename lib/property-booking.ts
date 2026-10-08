import type {
  PropertyDetail,
  PropertyRoomTypeDetail,
  PropertyRatePlanDetail,
  SelectedRoomPlan,
} from "@/types/property-detail";

function ratePlanPrice(plan: PropertyRatePlanDetail): number {
  return plan.pricePerNight ?? plan.totalPrice ?? 0;
}

function roomTypeLowestPrice(roomType: PropertyRoomTypeDetail): number {
  const prices = roomType.ratePlans
    .map(ratePlanPrice)
    .filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : 0;
}

/** Sorts room types and their rate plans from lowest to highest price. */
export function sortRoomTypesByPriceAsc(
  roomTypes: PropertyRoomTypeDetail[],
): PropertyRoomTypeDetail[] {
  return [...roomTypes]
    .map((roomType) => ({
      ...roomType,
      ratePlans: [...roomType.ratePlans].sort(
        (a, b) => ratePlanPrice(a) - ratePlanPrice(b),
      ),
    }))
    .sort((a, b) => roomTypeLowestPrice(a) - roomTypeLowestPrice(b));
}

export function planToSelection(
  roomType: PropertyRoomTypeDetail,
  ratePlanId: string,
): SelectedRoomPlan | null {
  const plan = roomType.ratePlans.find((item) => item.id === ratePlanId);
  if (!plan?.pricePerNight || !plan.totalPrice) return null;

  return {
    roomTypeId: roomType.id,
    roomTypeName: roomType.name,
    ratePlanId: plan.id,
    ratePlanName: plan.guestLabel ?? plan.name,
    pricePerNight: plan.pricePerNight,
    totalPrice: plan.totalPrice,
    estimatedTaxes: plan.estimatedTaxes,
    estimatedGst: plan.estimatedGst,
    estimatedPlatformFee: plan.estimatedPlatformFee,
    currency: plan.currency,
  };
}

export function getSelectedCancellationPolicy(
  property: PropertyDetail,
  selectedPlan: SelectedRoomPlan | null,
): { name: string; description: string } | null {
  if (!selectedPlan) return null;

  for (const roomType of property.roomTypes) {
    if (roomType.id !== selectedPlan.roomTypeId) continue;
    const plan = roomType.ratePlans.find(
      (item) => item.id === selectedPlan.ratePlanId,
    );
    return plan?.cancellationPolicy ?? null;
  }

  return null;
}

/** Lowest nightly rate across the property (for mobile dock). */
export function getPropertyMinPricePerNight(
  property: PropertyDetail,
): number | null {
  if (property.minPricePerNight != null && property.minPricePerNight > 0) {
    return property.minPricePerNight;
  }
  const plan = findLowestPricePlan(property);
  return plan?.pricePerNight ?? null;
}

/** Picks the cheapest available rate plan across all room types. */
export function findLowestPricePlan(
  property: PropertyDetail,
): SelectedRoomPlan | null {
  let best: SelectedRoomPlan | null = null;

  for (const roomType of property.roomTypes) {
    for (const plan of roomType.ratePlans) {
      if (plan.pricePerNight == null || plan.totalPrice == null) continue;

      const candidate = planToSelection(roomType, plan.id);
      if (!candidate) continue;

      if (!best || candidate.totalPrice < best.totalPrice) {
        best = candidate;
      }
    }
  }

  return best;
}
