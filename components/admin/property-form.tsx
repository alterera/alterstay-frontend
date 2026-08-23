"use client";

import { useEffect, useState } from "react";

import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Amenity, Property, PropertyType } from "@/types/admin";

type PropertyFormValues = {
  name: string;
  propertyTypeId: string;
  description: string;
  starRating: string;
  checkInTime: string;
  checkOutTime: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  amenityIds: string[];
};

type PropertyFormProps = {
  property?: Property;
  propertyTypes: PropertyType[];
  amenities: Amenity[];
  loading?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onAmenitiesChange?: (amenityIds: string[]) => Promise<void>;
  onImagesSelected?: (files: FileList) => Promise<void>;
  onDeleteImage?: (imageId: string) => Promise<void>;
};

function valuesFromProperty(property?: Property): PropertyFormValues {
  const address = property?.addresses[0];
  return {
    name: property?.name ?? "",
    propertyTypeId: property?.propertyType.id ?? "",
    description: property?.description ?? "",
    starRating: property?.starRating?.toString() ?? "",
    checkInTime: property?.checkInTime ?? "14:00",
    checkOutTime: property?.checkOutTime ?? "11:00",
    addressLine1: address?.addressLine1 ?? "",
    addressLine2: address?.addressLine2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    country: address?.country ?? "India",
    postalCode: address?.postalCode ?? "",
    latitude: address?.latitude ?? "",
    longitude: address?.longitude ?? "",
    amenityIds: property?.amenities.map((a) => a.amenity.id) ?? [],
  };
}

export function PropertyForm({
  property,
  propertyTypes,
  amenities,
  loading,
  onSubmit,
  onAmenitiesChange,
  onImagesSelected,
  onDeleteImage,
}: PropertyFormProps) {
  const [values, setValues] = useState<PropertyFormValues>(() =>
    valuesFromProperty(property),
  );

  useEffect(() => {
    if (property) setValues(valuesFromProperty(property));
  }, [property]);

  function update<K extends keyof PropertyFormValues>(
    key: K,
    value: PropertyFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAmenity(id: string) {
    setValues((prev) => {
      const exists = prev.amenityIds.includes(id);
      const amenityIds = exists
        ? prev.amenityIds.filter((x) => x !== id)
        : [...prev.amenityIds, id];
      void onAmenitiesChange?.(amenityIds);
      return { ...prev, amenityIds };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload: Record<string, unknown> = {
      name: values.name,
      propertyTypeId: values.propertyTypeId,
      description: values.description || undefined,
      starRating: values.starRating ? Number(values.starRating) : undefined,
      checkInTime: values.checkInTime || undefined,
      checkOutTime: values.checkOutTime || undefined,
      address: {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2 || undefined,
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode || undefined,
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
      },
    };

    // Amenities are managed via PUT /amenities on edit; only include on create.
    if (!property) {
      payload.amenityIds = values.amenityIds;
    }

    await onSubmit(payload);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4 rounded-lg border bg-background p-6">
        <h2 className="font-medium">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Property type</Label>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
              value={values.propertyTypeId}
              onChange={(e) => update("propertyTypeId", e.target.value)}
              required
            >
              <option value="">Select type</option>
              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stars">Star rating</Label>
            <Input
              id="stars"
              type="number"
              min={1}
              max={5}
              value={values.starRating}
              onChange={(e) => update("starRating", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkIn">Check-in time</Label>
            <Input
              id="checkIn"
              value={values.checkInTime}
              onChange={(e) => update("checkInTime", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOut">Check-out time</Label>
            <Input
              id="checkOut"
              value={values.checkOutTime}
              onChange={(e) => update("checkOutTime", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-lg border bg-background p-6">
        <h2 className="font-medium">Address</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="line1">Address line 1</Label>
            <Input
              id="line1"
              value={values.addressLine1}
              onChange={(e) => update("addressLine1", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="line2">Address line 2</Label>
            <Input
              id="line2"
              value={values.addressLine2}
              onChange={(e) => update("addressLine2", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={values.city}
              onChange={(e) => update("city", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={values.state}
              onChange={(e) => update("state", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={values.country}
              onChange={(e) => update("country", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal">Postal code</Label>
            <Input
              id="postal"
              value={values.postalCode}
              onChange={(e) => update("postalCode", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              value={values.latitude}
              onChange={(e) => update("latitude", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              value={values.longitude}
              onChange={(e) => update("longitude", e.target.value)}
            />
          </div>
        </div>
      </section>

      {amenities.length ? (
        <section className="space-y-4 rounded-lg border bg-background p-6">
          <h2 className="font-medium">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const selected = values.amenityIds.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                    selected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {amenity.name}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? <Loader2Icon className="animate-spin" /> : null}
          {loading ? "Saving…" : property ? "Save changes" : "Create property"}
        </Button>
      </form>

      {property && onImagesSelected ? (
        <section className="space-y-4 rounded-lg border bg-background p-6">
          <h2 className="font-medium">Images</h2>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) {
                void onImagesSelected(e.target.files);
                e.target.value = "";
              }
            }}
          />
          {property.images.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {property.images.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {onDeleteImage ? (
                    <button
                      type="button"
                      onClick={() => void onDeleteImage(image.id)}
                      className="absolute right-2 top-2 rounded bg-background/90 px-2 py-0.5 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
