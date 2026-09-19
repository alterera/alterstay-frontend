"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PropertyForm } from "@/components/admin/property-form";
import { PropertyCatalogPanels } from "@/components/admin/property-catalog-panels";
import { PropertyContentPanel } from "@/components/admin/property/property-content-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  deletePropertyImage,
  setPropertyThumbnail,
  fetchAdminCities,
  fetchAmenities,
  fetchProperty,
  fetchPropertyTypes,
  updateProperty,
  updatePropertyStatus,
  uploadPropertyImage,
} from "@/lib/admin-api";
import type {
  AdminCity,
  Amenity,
  Property,
  PropertyType,
} from "@/types/admin";

type Tab = "details" | "content" | "rooms" | "inventory" | "pricing";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("details");
  const [property, setProperty] = useState<Property | null>(null);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [cities, setCities] = useState<AdminCity[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [p, t, c, a] = await Promise.all([
      fetchProperty(params.id),
      fetchPropertyTypes(),
      fetchAdminCities(),
      fetchAmenities(),
    ]);
    setProperty(p);
    setTypes(t);
    setCities(c);
    setAmenities(a);
  }, [params.id]);

  useEffect(() => {
    load().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load"),
    );
  }, [load]);

  if (error && !property) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!property) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "content", label: "Content" },
    { id: "rooms", label: "Room catalog" },
    { id: "inventory", label: "Inventory" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.admin.properties}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {property.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Status: {property.status}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.status === "DRAFT" ? (
            <Button
              size="sm"
              onClick={async () => {
                const updated = await updatePropertyStatus(property.id, "ACTIVE");
                setProperty(updated);
              }}
            >
              Activate
            </Button>
          ) : property.status === "ACTIVE" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const updated = await updatePropertyStatus(
                  property.id,
                  "INACTIVE",
                );
                setProperty(updated);
              }}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const updated = await updatePropertyStatus(property.id, "ACTIVE");
                setProperty(updated);
              }}
            >
              Set active
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`border-b-2 px-4 py-2 text-sm transition-colors ${
              tab === item.id
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {tab === "details" ? (
        <PropertyForm
          property={property}
          propertyTypes={types}
          cities={cities}
          loading={loading}
          onSubmit={async (values) => {
            setLoading(true);
            setError(null);
            try {
              const updated = await updateProperty(property.id, values);
              setProperty(updated);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Save failed");
            } finally {
              setLoading(false);
            }
          }}
          onImagesSelected={async (files) => {
            setLoading(true);
            try {
              for (const file of Array.from(files)) {
                await uploadPropertyImage(property.id, file);
              }
              await load();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
              setLoading(false);
            }
          }}
          onDeleteImage={async (imageId) => {
            await deletePropertyImage(property.id, imageId);
            await load();
          }}
          onSetThumbnail={async (imageId) => {
            setLoading(true);
            try {
              const updated = await setPropertyThumbnail(property.id, imageId);
              setProperty(updated);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Thumbnail update failed");
            } finally {
              setLoading(false);
            }
          }}
        />
      ) : tab === "content" ? (
        <PropertyContentPanel
          property={property}
          amenities={amenities}
          onSaved={(updated) => setProperty(updated)}
        />
      ) : (
        <PropertyCatalogPanels propertyId={property.id} tab={tab} />
      )}
    </div>
  );
}
