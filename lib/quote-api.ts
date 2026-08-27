import { getApiBase, refreshSession } from "@/lib/auth-api";
import { getAccessToken, getRefreshToken } from "@/lib/auth-storage";
import type {
  BookingIntentResponse,
  QuoteResponse,
  QuoteSelectionInput,
} from "@/types/quote";

async function quoteFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (init.auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(`${getApiBase()}${path}`, { ...init, headers });

  if (response.status === 401 && init.auth && getRefreshToken()) {
    await refreshSession();
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    response = await fetch(`${getApiBase()}${path}`, { ...init, headers });
  }

  if (!response.ok) {
    let message = response.statusText || "Request failed";
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) message = body.message.join(", ");
      else if (body.message) message = body.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function toQuery(input: QuoteSelectionInput): string {
  const params = new URLSearchParams({
    propertySlug: input.propertySlug,
    roomTypeId: input.roomTypeId,
    ratePlanId: input.ratePlanId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    rooms: String(input.rooms),
    adults: String(input.adults),
  });
  return params.toString();
}

export function fetchQuote(input: QuoteSelectionInput) {
  return quoteFetch<QuoteResponse>(`/quotes?${toQuery(input)}`);
}

export function createBookingIntent(input: QuoteSelectionInput) {
  return quoteFetch<BookingIntentResponse>("/bookings/intent", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}
