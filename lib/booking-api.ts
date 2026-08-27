import { getAccessToken, getRefreshToken } from "@/lib/auth-storage";
import { getApiBase, refreshSession } from "@/lib/auth-api";
import type {
  BookingListResponse,
  BookingListTab,
  BookingResponse,
  CreateBookingRequest,
  PaymentSessionResponse,
} from "@/types/booking";

export class BookingApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly retryAfterSec?: number,
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

async function parseError(response: Response): Promise<BookingApiError> {
  try {
    const body = (await response.json()) as {
      message?: string | string[];
      retryAfterSec?: number;
    };
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message || response.statusText || "Request failed";
    return new BookingApiError(message, response.status, body.retryAfterSec);
  } catch {
    return new BookingApiError(
      response.statusText || "Request failed",
      response.status,
    );
  }
}

async function bookingFetchResponse(
  path: string,
  init: RequestInit,
  allowRefresh = true,
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiBase()}${path}`, { ...init, headers });

  if (response.status === 401 && allowRefresh && getRefreshToken()) {
    try {
      await refreshSession();
    } catch {
      return response;
    }
    return bookingFetchResponse(path, init, false);
  }

  return response;
}

async function bookingFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await bookingFetchResponse(path, init);
  if (!response.ok) throw await parseError(response);
  return response.json() as Promise<T>;
}

export function createBooking(body: CreateBookingRequest, idempotencyKey: string) {
  return bookingFetch<BookingResponse>("/bookings", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(body),
  });
}

export function createPaymentSession(reference: string) {
  return bookingFetch<PaymentSessionResponse>(
    `/bookings/${encodeURIComponent(reference)}/payment-session`,
    { method: "POST" },
  );
}

export function fetchBooking(reference: string) {
  return bookingFetch<BookingResponse>(
    `/bookings/${encodeURIComponent(reference)}`,
  );
}

export function fetchMyBookings(tab: BookingListTab, page = 1, limit = 20) {
  const params = new URLSearchParams({
    tab,
    page: String(page),
    limit: String(limit),
  });
  return bookingFetch<BookingListResponse>(`/bookings/me?${params.toString()}`);
}
