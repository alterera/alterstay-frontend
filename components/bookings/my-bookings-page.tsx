"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { BookingListCard } from "@/components/bookings/booking-list-card";
import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { BookingsListSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMyBookings } from "@/lib/booking-api";
import { cn } from "@/lib/utils";
import type { BookingListTab, BookingResponse } from "@/types/booking";

const ALWAYS_TABS: { id: BookingListTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "previous", label: "Previous" },
  { id: "cancelled", label: "Cancelled" },
];

export function MyBookingsPage() {
  const { isAuthenticated, isLoading, openLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<BookingListTab>("upcoming");
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPending, setHasPending] = useState(false);
  const [hasOngoing, setHasOngoing] = useState(false);
  const [tabsReady, setTabsReady] = useState(false);

  const visibleTabs = useMemo(() => {
    const tabs: { id: BookingListTab; label: string }[] = [];
    if (hasPending) tabs.push({ id: "pending", label: "Pending payment" });
    if (hasOngoing) tabs.push({ id: "ongoing", label: "Ongoing" });
    tabs.push(...ALWAYS_TABS);
    return tabs;
  }, [hasOngoing, hasPending]);

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
    if (!isAuthenticated || tabsReady) return;

    async function pickDefaultTab() {
      try {
        const [pending, ongoing] = await Promise.all([
          fetchMyBookings("pending", 1, 1),
          fetchMyBookings("ongoing", 1, 1),
        ]);
        const pendingExists = pending.total > 0;
        const ongoingExists = ongoing.total > 0;
        setHasPending(pendingExists);
        setHasOngoing(ongoingExists);
        setActiveTab(
          pendingExists ? "pending" : ongoingExists ? "ongoing" : "upcoming",
        );
      } catch {
        setActiveTab("upcoming");
      } finally {
        setTabsReady(true);
      }
    }

    void pickDefaultTab();
  }, [isAuthenticated, tabsReady]);

  useEffect(() => {
    if (!isAuthenticated || !tabsReady) return;
    void loadBookings(activeTab);
  }, [activeTab, isAuthenticated, loadBookings, tabsReady]);

  if (isLoading) {
    return (
      <section className="bg-background pb-8 pt-6 lg:pt-10">
        <BookingsListSkeleton />
      </section>
    );
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
    <section className="bg-background pb-8 pt-6 lg:pt-10">
      <Container>
        <h1 className="mb-5 text-2xl font-bold tracking-tight">My Bookings</h1>

        <div className="mb-6 flex border-b overflow-x-auto">
          {visibleTabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors sm:px-5",
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
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border bg-muted/20 px-4 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No{" "}
              {activeTab === "pending"
                ? "pending payment"
                : activeTab === "previous"
                  ? "previous"
                  : activeTab}{" "}
              bookings yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
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
