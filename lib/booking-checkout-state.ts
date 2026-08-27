import type { BookingStatus } from "@/types/booking";
import type { QuoteResponse, QuoteSelectionInput } from "@/types/quote";

const STORAGE_PREFIX = "alterstays.checkout.quote.";

export type CheckoutQuoteSession = {
  quoteToken: string;
  expiresAt: string;
  quote: QuoteResponse;
  idempotencyKey?: string;
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

function storageKey(selection: QuoteSelectionInput): string {
  return `${STORAGE_PREFIX}${[
    selection.propertySlug,
    selection.checkIn,
    selection.checkOut,
    selection.roomTypeId,
    selection.ratePlanId,
    selection.rooms,
    selection.adults,
  ].join("|")}`;
}

function readRaw(key: string): CheckoutQuoteSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CheckoutQuoteSession;
    if (!parsed.quoteToken || !parsed.expiresAt || !parsed.quote) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeRaw(key: string, session: CheckoutQuoteSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(session));
}

export function loadCheckoutSession(
  selection: QuoteSelectionInput,
): CheckoutQuoteSession | null {
  return readRaw(storageKey(selection));
}

export function saveCheckoutSession(
  selection: QuoteSelectionInput,
  session: CheckoutQuoteSession,
): void {
  const existing = readRaw(storageKey(selection));
  writeRaw(storageKey(selection), {
    ...session,
    idempotencyKey: session.idempotencyKey ?? existing?.idempotencyKey,
  });
}

export function clearCheckoutSession(selection: QuoteSelectionInput): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(storageKey(selection));
}

export function getOrCreateCheckoutIdempotencyKey(
  selection: QuoteSelectionInput,
): string {
  const existing = loadCheckoutSession(selection);
  if (existing?.idempotencyKey) return existing.idempotencyKey;
  const idempotencyKey = crypto.randomUUID();
  if (existing) {
    saveCheckoutSession(selection, { ...existing, idempotencyKey });
  }
  return idempotencyKey;
}
