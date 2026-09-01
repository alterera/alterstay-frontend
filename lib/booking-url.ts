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

export function buildCheckoutUrl(
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  return `/properties/${slug}/checkout?${buildBookingQueryString(search, plan)}`;
}

/** @deprecated Use buildCheckoutUrl */
export function buildBookingSummaryUrl(
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  return buildCheckoutUrl(slug, search, plan);
}

export function buildCheckoutLoginUrl(
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  return `/properties/${slug}/checkout/login?${buildBookingQueryString(search, plan)}`;
}

/** @deprecated Use buildCheckoutLoginUrl */
export function buildBookingLoginUrl(
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): string {
  return buildCheckoutLoginUrl(slug, search, plan);
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
  discount: number;
  coinsApplied?: number;
  tax: number;
  toPay: number;
  currency: string;
  membershipDiscountLabel?: string;
  coinEarnPreview?: {
    planCode: string;
    earnPercent: number;
    earnableAmount: number;
  };
};

/** Server-aligned estimate: subtotal + 18% tax, no mock discounts or fees. */
export function estimateBillFromPlan(plan: SelectedRoomPlan): BookingBill {
  const roomPrice = plan.totalPrice;
  const tax = plan.estimatedTaxes ?? Math.round(roomPrice * 0.18);
  return {
    roomPrice,
    discount: 0,
    tax,
    toPay: roomPrice + tax,
    currency: plan.currency,
  };
}

/** @deprecated Use estimateBillFromPlan — kept for any stale imports during migration. */
export function calculateBookingBill(plan: SelectedRoomPlan): BookingBill {
  return estimateBillFromPlan(plan);
}
