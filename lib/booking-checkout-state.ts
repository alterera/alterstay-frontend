import type { BookingStatus } from "@/types/booking";

const STORAGE_PREFIX = "alterstays.checkout.";

export type CheckoutSelection = {
  slug: string;
  checkIn: string;
  checkOut: string;
  roomTypeId: string;
  ratePlanId: string;
  userId: string;
};

export type CheckoutAttempt = {
  idempotencyKey: string;
  reservationNumber?: string;
};

const TERMINAL_STATUSES = new Set<BookingStatus>([
  "CONFIRMED",
  "EXPIRED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export function isTerminalBookingStatus(status: BookingStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

function storageKey(selection: CheckoutSelection): string {
  return `${STORAGE_PREFIX}${[
    selection.userId,
    selection.slug,
    selection.checkIn,
    selection.checkOut,
    selection.roomTypeId,
    selection.ratePlanId,
  ].join("|")}`;
}

function readRaw(key: string): CheckoutAttempt | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CheckoutAttempt;
    if (!parsed.idempotencyKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRaw(key: string, attempt: CheckoutAttempt): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(attempt));
}

export function loadCheckoutAttempt(
  selection: CheckoutSelection,
): CheckoutAttempt | null {
  return readRaw(storageKey(selection));
}

export function saveCheckoutAttempt(
  selection: CheckoutSelection,
  attempt: CheckoutAttempt,
): void {
  writeRaw(storageKey(selection), attempt);
}

export function clearCheckoutAttempt(selection: CheckoutSelection): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(storageKey(selection));
}

export function getOrCreateIdempotencyKey(selection: CheckoutSelection): string {
  const existing = loadCheckoutAttempt(selection);
  if (existing?.idempotencyKey) return existing.idempotencyKey;
  const idempotencyKey = crypto.randomUUID();
  saveCheckoutAttempt(selection, { idempotencyKey });
  return idempotencyKey;
}

export function persistReservationNumber(
  selection: CheckoutSelection,
  reservationNumber: string,
): void {
  const current =
    loadCheckoutAttempt(selection) ?? { idempotencyKey: crypto.randomUUID() };
  saveCheckoutAttempt(selection, { ...current, reservationNumber });
}
