"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PropertyForm } from "@/components/admin/property-form";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  createProperty,
  fetchAmenities,
  fetchPropertyTypes,
} from "@/lib/admin-api";
import type { Amenity, PropertyType } from "@/types/admin";

export default function NewPropertyPage() {
  const router = useRouter();
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchPropertyTypes(), fetchAmenities()])
      .then(([t, a]) => {
        setTypes(t);
        setAmenities(a);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load form data"),
      );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.admin.properties}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New property</h1>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <PropertyForm
        propertyTypes={types}
        amenities={amenities}
        loading={loading}
        onSubmit={async (values) => {
          setLoading(true);
          setError(null);
          try {
            const property = await createProperty(values);
            router.push(`${ROUTES.admin.properties}/${property.id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Create failed");
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
