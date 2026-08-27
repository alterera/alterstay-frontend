"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BookingListCard } from "@/components/bookings/booking-list-card";
import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { fetchMyBookings } from "@/lib/booking-api";
import { cn } from "@/lib/utils";
import type { BookingListTab, BookingResponse } from "@/types/booking";

const TABS: { id: BookingListTab; label: string }[] = [
  { id: "pending", label: "Pending payment" },
  { id: "upcoming", label: "Upcoming" },
  { id: "ongoing", label: "Ongoing" },
  { id: "cancelled", label: "Cancelled" },
];

export function MyBookingsPage() {
  const { isAuthenticated, isLoading, openLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<BookingListTab>("upcoming");
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultTabSet = useRef(false);

  const loadBookings = useCallback(async (tab: BookingListTab) => {
    setLoadingBookings(true);
    setError(null);
    try {
      const response = await fetchMyBookings(tab);
      setBookings(response.results);
    } catch (err) {
      setBookings([]);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || defaultTabSet.current) return;

    async function pickDefaultTab() {
      try {
        const pending = await fetchMyBookings("pending", 1, 1);
        setActiveTab(pending.total > 0 ? "pending" : "upcoming");
      } catch {
        setActiveTab("upcoming");
      } finally {
        defaultTabSet.current = true;
      }
    }

    void pickDefaultTab();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !defaultTabSet.current) return;
    void loadBookings(activeTab);
  }, [activeTab, isAuthenticated, loadBookings]);

  if (isLoading) {
    return <div className="min-h-[40vh] bg-background" />;
  }

  if (!isAuthenticated) {
    return (
      <section className="bg-background py-16">
        <Container className="max-w-lg text-center">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to view your bookings.
          </p>
          <Button className="mt-6 rounded-xl" onClick={openLogin}>
            Login
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background pb-8 pt-6 lg:pt-24">
      <Container className="max-w-2xl">
        <h1 className="mb-5 text-2xl font-bold tracking-tight">My Bookings</h1>

        <div className="mb-6 flex border-b overflow-x-auto">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:flex-1 sm:px-2",
                  active
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        ) : null}

        {loadingBookings ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border bg-muted/20 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No {activeTab === "pending" ? "pending payment" : activeTab}{" "}
              bookings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingListCard
                key={booking.reservationNumber}
                booking={booking}
                tab={activeTab}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
