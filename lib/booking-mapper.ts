import type { GuestFormState } from "@/components/booking/booking-guest-form";
import { normalizeBookingPhone } from "@/lib/format";
import { formatDateParam } from "@/lib/search-params";
import type { PropertySearchParams } from "@/types/search";
import type { SelectedRoomPlan } from "@/types/property-detail";
import type { CreateBookingRequest } from "@/types/booking";

export type GuestFormFieldErrors = Partial<
  Record<
    | "guestName"
    | "email"
    | "mobile"
    | "gstNumber"
    | "companyName"
    | "companyAddress"
    | "dates",
    string
  >
>;

export type MapGuestFormResult =
  | { ok: true; request: CreateBookingRequest }
  | { ok: false; errors: GuestFormFieldErrors };

export function splitGuestName(guestName: string): {
  firstName: string;
  lastName?: string;
} {
  const trimmed = guestName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "" };
  const [firstName, ...rest] = parts;
  return rest.length ? { firstName, lastName: rest.join(" ") } : { firstName };
}

export function validateGuestForm(form: GuestFormState): GuestFormFieldErrors {
  const errors: GuestFormFieldErrors = {};
  if (!form.guestName.trim()) errors.guestName = "Guest name is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.mobile.trim()) errors.mobile = "Mobile number is required.";

  if (form.isBusinessBooking) {
    if (!form.gstNumber.trim()) {
      errors.gstNumber = "GST number is required for business bookings.";
    }
    if (!form.companyName.trim()) {
      errors.companyName = "Company name is required for business bookings.";
    }
    if (!form.companyAddress.trim()) {
      errors.companyAddress = "Company address is required for business bookings.";
    }
  }

  return errors;
}

export function mapGuestFormToCreateBooking(
  form: GuestFormState,
  slug: string,
  search: PropertySearchParams,
  plan: SelectedRoomPlan,
): MapGuestFormResult {
  const fieldErrors = validateGuestForm(form);
  const checkIn = search.dateRange.from
    ? formatDateParam(search.dateRange.from)
    : "";
  const checkOut = search.dateRange.to
    ? formatDateParam(search.dateRange.to)
    : "";

  if (!checkIn || !checkOut || checkIn >= checkOut) {
    fieldErrors.dates = "Valid check-in and check-out dates are required.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, errors: fieldErrors };
  }

  const { firstName, lastName } = splitGuestName(form.guestName);
  const request: CreateBookingRequest = {
    propertySlug: slug,
    roomTypeId: plan.roomTypeId,
    ratePlanId: plan.ratePlanId,
    checkIn,
    checkOut,
    rooms: search.guests.rooms,
    adults: search.guests.adults,
    guest: {
      firstName,
      lastName,
      email: form.email.trim(),
      phone: normalizeBookingPhone(form.mobile),
    },
  };

  if (form.isBusinessBooking) {
    request.businessBooking = {
      companyName: form.companyName.trim(),
      gstin: form.gstNumber.trim(),
      billingAddress: form.companyAddress.trim(),
    };
  }

  return { ok: true, request };
}
