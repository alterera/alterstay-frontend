import { format } from "date-fns";

import type { DateRange, GuestCounts } from "@/types/search";

export function formatSingleDate(date: Date | undefined, fallback = "Select date"): string {
  if (!date) return fallback;
  return format(date, "dd MMM yyyy");
}

export function formatDateRange(range: DateRange): string {
  if (!range.from) return "Select dates";

  if (!range.to) {
    return formatSingleDate(range.from);
  }

  return `${formatSingleDate(range.from)} - ${formatSingleDate(range.to)}`;
}

export function getStayNights(range: DateRange): number {
  if (!range.from || !range.to) return 0;

  const msPerDay = 1000 * 60 * 60 * 24;
  const from = new Date(range.from);
  const to = new Date(range.to);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  return Math.max(0, Math.round((to.getTime() - from.getTime()) / msPerDay));
}

export function formatGuestSummary(guests: GuestCounts): string {
  const parts: string[] = [];

  if (guests.rooms > 0) {
    parts.push(`${guests.rooms} ${guests.rooms === 1 ? "Room" : "Rooms"}`);
  }

  if (guests.adults > 0) {
    parts.push(`${guests.adults} ${guests.adults === 1 ? "Adult" : "Adults"}`);
  }

  return parts.join(", ") || "Add guests";
}

/** Short guest count for compact search bars, e.g. "2 guests". */
export function formatGuestCountShort(guests: GuestCounts): string {
  if (guests.adults <= 0) return "Add guests";
  return `${guests.adults} ${guests.adults === 1 ? "guest" : "guests"}`;
}

/** Compact date range for property cards, e.g. "19 Aug - 20 Aug". */
export function formatCompactDateRange(range: DateRange): string {
  if (!range.from) return "Select dates";
  const fromLabel = format(range.from, "d MMM");
  if (!range.to) return fromLabel;
  return `${fromLabel} - ${format(range.to, "d MMM")}`;
}

export function formatCurrency(
  amount: number,
  currency = "INR",
): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Property check-in/out time, e.g. "14:00" → "02 PM". */
export function formatPropertyTime(time: string | null | undefined): string {
  if (!time) return "";
  const [hourPart, minutePart] = time.split(":");
  const hour = Number(hourPart);
  const minute = Number(minutePart ?? "0");
  if (Number.isNaN(hour)) return time;

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const minuteLabel =
    minute > 0 ? `:${String(minute).padStart(2, "0")}` : "";

  return `${String(hour12).padStart(2, "0")}${minuteLabel} ${period}`;
}

/** Booking summary date + time, e.g. "20 Aug 26, 02 PM". */
export function formatBookingDateTime(
  date: Date | undefined,
  time: string | null | undefined,
  fallback = "—",
): string {
  if (!date) return fallback;
  const dateLabel = format(date, "dd MMM yy");
  const timeLabel = formatPropertyTime(time);
  return timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel;
}

/** Strip common country prefixes for display in guest forms. */
export function formatDisplayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits || phone;
}

/** Normalize a guest-entered mobile number for the booking API. */
export function normalizeBookingPhone(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) return mobile.trim();

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (mobile.trim().startsWith("+")) {
    return mobile.trim();
  }
  return `+${digits}`;
}

/** Navbar / mobile summary date format, e.g. "Mon, 17 Aug — Tue, 18 Aug". */
export function formatNavDateRange(range: DateRange): string {
  if (!range.from) return "Select dates";

  const fromLabel = format(range.from, "EEE, d MMM");

  if (!range.to) {
    return fromLabel;
  }

  return `${fromLabel} — ${format(range.to, "EEE, d MMM")}`;
}
