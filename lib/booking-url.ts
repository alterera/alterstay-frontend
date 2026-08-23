import type { PropertySearchParams } from "@/types/search";
import type { SelectedRoomPlan } from "@/types/property-detail";
import { buildPropertyQueryString } from "@/lib/property-url";

export function buildBookingQueryString(
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  const query = new URLSearchParams(buildPropertyQueryString(search));
  query.set("ratePlanId", plan.ratePlanId);
  query.set("roomTypeId", plan.roomTypeId);
  return query.toString();
}

export function buildBookingSummaryUrl(
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  return `/properties/${slug}/book?${buildBookingQueryString(search, plan)}`;
}

export function buildBookingLoginUrl(
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  return `/properties/${slug}/book/login?${buildBookingQueryString(search, plan)}`;
}

export const AUTH_POST_LOGIN_REDIRECT_KEY = "auth.postLoginRedirect";

export function setPostLoginRedirect(url: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_POST_LOGIN_REDIRECT_KEY, url);
}

export function consumePostLoginRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const url = sessionStorage.getItem(AUTH_POST_LOGIN_REDIRECT_KEY);
  if (url) sessionStorage.removeItem(AUTH_POST_LOGIN_REDIRECT_KEY);
  return url;
}

export type BookingBill = {
  roomPrice: number;
  tax: number;
  toPay: number;
  currency: string;
};

/** Server-aligned estimate: subtotal + 18% tax, no mock discounts or fees. */
export function estimateBillFromPlan(plan: SelectedRoomPlan): BookingBill {
  const roomPrice = plan.totalPrice;
  const tax = plan.estimatedTaxes ?? Math.round(roomPrice * 0.18);
  return {
    roomPrice,
    tax,
    toPay: roomPrice + tax,
    currency: plan.currency,
  };
}

/** @deprecated Use estimateBillFromPlan — kept for any stale imports during migration. */
export function calculateBookingBill(plan: SelectedRoomPlan): BookingBill {
  return estimateBillFromPlan(plan);
}
