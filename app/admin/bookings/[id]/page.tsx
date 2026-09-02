"use client";

import { useParams } from "next/navigation";

import { BookingDetailView } from "@/components/admin/bookings/booking-detail-view";

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  return <BookingDetailView bookingId={params.id} />;
}
