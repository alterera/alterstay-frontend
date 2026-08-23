import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { BookingPaymentResultPage } from "@/components/booking/booking-payment-result-page";

const mockOpenLogin = vi.fn();
const mockFetchBooking = vi.fn();
const mockSetPostLoginRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("ref=ALTSTAY-1"),
}));

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    openLogin: mockOpenLogin,
    user: null,
  }),
}));

vi.mock("@/lib/booking-api", () => ({
  BookingApiError: class BookingApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  fetchBooking: (...args: unknown[]) => mockFetchBooking(...args),
}));

vi.mock("@/lib/booking-url", () => ({
  setPostLoginRedirect: (...args: unknown[]) => mockSetPostLoginRedirect(...args),
}));

describe("BookingPaymentResultPage login return", () => {
  beforeEach(() => {
    mockOpenLogin.mockReset();
    mockSetPostLoginRedirect.mockReset();
  });

  it("stores the result URL and opens the login dialog when unauthenticated", () => {
    render(<BookingPaymentResultPage />);
    expect(mockSetPostLoginRedirect).toHaveBeenCalledWith(
      "/bookings/result?ref=ALTSTAY-1",
    );
    expect(mockOpenLogin).toHaveBeenCalled();
    expect(screen.getByText(/Sign in to view your booking/i)).toBeInTheDocument();
  });
});
