"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2Icon, CalendarCheckIcon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { fetchProperties } from "@/lib/admin-api";
import type { PropertyListItem } from "@/types/admin";

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<PropertyListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      );
  }, []);

  const activeCount =
    properties?.filter((property) => property.status === "ACTIVE").length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of listings and operations
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Properties</CardDescription>
            <CardTitle className="text-3xl">
              {properties ? properties.length : <Skeleton className="h-8 w-16" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Building2Icon className="size-4" />
              {activeCount} active
            </span>
            <Button
              size="sm"
              variant="outline"
              render={<Link href={ROUTES.admin.properties} />}
            >
              View all
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Bookings</CardDescription>
            <CardTitle className="text-3xl">—</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarCheckIcon className="size-4" />
              Coming soon
            </span>
            <Button
              size="sm"
              variant="outline"
              render={<Link href={ROUTES.admin.bookings} />}
            >
              Open
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Quick action</CardDescription>
            <CardTitle className="text-lg">Add a listing</CardTitle>
          </CardHeader>
          <CardContent>
            <Button render={<Link href={`${ROUTES.admin.properties}/new`} />}>
              <PlusIcon />
              New property
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
