import type { Metadata } from "next";

import { MyBookingsPage } from "@/components/bookings/my-bookings-page";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your AlterStays bookings.",
};

export default function BookingsPage() {
  return <MyBookingsPage />;
}
