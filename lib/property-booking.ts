import type {
  PropertyDetail,
  PropertyRoomTypeDetail,
  SelectedRoomPlan,
} from "@/types/property-detail";

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
    ratePlanName: plan.name,
    pricePerNight: plan.pricePerNight,
    totalPrice: plan.totalPrice,
    estimatedTaxes: plan.estimatedTaxes,
    currency: plan.currency,
  };
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
