import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Reservation list and status will live here
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Not wired yet</CardTitle>
          <CardDescription>
            This is a placeholder so the admin shell and navigation are in place.
            Connect it to the bookings API when that operator view is ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          You will be able to filter by property, date, and payment status.
        </CardContent>
      </Card>
    </div>
  );
}
