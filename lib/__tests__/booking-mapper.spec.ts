import { describe, expect, it } from "vitest";

import type { GuestFormState } from "@/components/booking/booking-guest-form";
import {
  mapGuestFormToCreateBooking,
  splitGuestName,
  validateGuestForm,
} from "@/lib/booking-mapper";
import { normalizeBookingPhone } from "@/lib/format";
import type { PropertySearchParams } from "@/types/search";
import type { SelectedRoomPlan } from "@/types/property-detail";

const plan: SelectedRoomPlan = {
  roomTypeId: "room-1",
  roomTypeName: "Deluxe",
  ratePlanId: "rate-1",
  ratePlanName: "Room Only",
  pricePerNight: 5000,
  totalPrice: 10000,
  estimatedTaxes: 1800,
  currency: "INR",
};

const search: PropertySearchParams = {
  city: "Mumbai",
  dateRange: {
    from: new Date("2026-11-17T00:00:00"),
    to: new Date("2026-11-19T00:00:00"),
  },
  guests: { rooms: 1, adults: 2, children: 0 },
};

const baseForm: GuestFormState = {
  guestName: "Asha Rao",
  email: "asha@example.com",
  mobile: "9876543210",
  whatsappNotify: true,
  isBusinessBooking: false,
  gstNumber: "",
  companyName: "",
  companyAddress: "",
};

describe("splitGuestName", () => {
  it("splits first and last names", () => {
    expect(splitGuestName("Asha Rao")).toEqual({
      firstName: "Asha",
      lastName: "Rao",
    });
  });
});

describe("normalizeBookingPhone", () => {
  it("normalizes a 10-digit Indian mobile number", () => {
    expect(normalizeBookingPhone("9876543210")).toBe("+919876543210");
  });
});

describe("validateGuestForm", () => {
  it("requires business fields when the toggle is on", () => {
    const errors = validateGuestForm({
      ...baseForm,
      isBusinessBooking: true,
    });
    expect(errors.gstNumber).toBeTruthy();
    expect(errors.companyName).toBeTruthy();
    expect(errors.companyAddress).toBeTruthy();
  });
});

describe("mapGuestFormToCreateBooking", () => {
  it("maps guest and stay fields for a personal booking", () => {
    const mapped = mapGuestFormToCreateBooking(
      baseForm,
      "hotel-alpha",
      search,
      plan,
    );
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;
    expect(mapped.request).toMatchObject({
      propertySlug: "hotel-alpha",
      roomTypeId: "room-1",
      ratePlanId: "rate-1",
      checkIn: "2026-11-17",
      checkOut: "2026-11-19",
      guest: {
        firstName: "Asha",
        lastName: "Rao",
        phone: "+919876543210",
      },
    });
    expect(mapped.request.businessBooking).toBeUndefined();
  });

  it("includes the business block when enabled", () => {
    const mapped = mapGuestFormToCreateBooking(
      {
        ...baseForm,
        isBusinessBooking: true,
        gstNumber: "29ABCDE1234F1Z5",
        companyName: "Alterera",
        companyAddress: "MG Road",
      },
      "hotel-alpha",
      search,
      plan,
    );
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;
    expect(mapped.request.businessBooking).toEqual({
      companyName: "Alterera",
      gstin: "29ABCDE1234F1Z5",
      billingAddress: "MG Road",
    });
  });
});
