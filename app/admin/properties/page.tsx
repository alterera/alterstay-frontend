"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

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

function statusVariant(status: string) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "DRAFT") return "warning" as const;
  if (status === "SUSPENDED") return "destructive" as const;
  return "secondary" as const;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-sm text-muted-foreground">
            Manage listings, rooms, inventory, and pricing
          </p>
        </div>
        <Button render={<Link href={`${ROUTES.admin.properties}/new`} />}>
          <PlusIcon />
          New property
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="space-y-3 pt-0">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : properties.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No properties yet</CardTitle>
            <CardDescription>Create a listing to start selling rooms.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href={`${ROUTES.admin.properties}/new`} />}>
              Create your first property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-0">
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => {
                  const city = property.addresses[0]?.city ?? "—";
                  return (
                    <tr key={property.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{property.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{city}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {property.propertyType.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(property.status)}>
                          {property.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          render={
                            <Link
                              href={`${ROUTES.admin.properties}/${property.id}`}
                            />
                          }
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
