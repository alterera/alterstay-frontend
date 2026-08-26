"use client";

import { useEffect, useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAdminArea,
  createAdminCity,
  deleteAdminArea,
  deleteAdminCity,
  fetchAdminCities,
  updateAdminArea,
  updateAdminCity,
} from "@/lib/admin-api";
import type { AdminCity } from "@/types/admin";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<AdminCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [cityForm, setCityForm] = useState({
    name: "",
    state: "",
    country: "India",
  });
  const [areaDrafts, setAreaDrafts] = useState<Record<string, string>>({});

  async function load() {
    const data = await fetchAdminCities();
    setCities(data);
  }

  useEffect(() => {
    load()
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load cities"),
      )
      .finally(() => setLoading(false));
  }, []);

  async function run(action: () => Promise<void>) {
    setSaving(true);
    setError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cities & areas</h1>
        <p className="text-sm text-muted-foreground">
          Neighbourhoods shown on search filters and property addresses
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Add city</CardTitle>
          <CardDescription>
            New cities become available in search as soon as properties use them.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-[1fr_1fr_8rem_auto]">
          <div className="space-y-1">
            <Label htmlFor="city-name">Name</Label>
            <Input
              id="city-name"
              value={cityForm.name}
              onChange={(e) =>
                setCityForm((current) => ({ ...current, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="city-state">State</Label>
            <Input
              id="city-state"
              value={cityForm.state}
              onChange={(e) =>
                setCityForm((current) => ({ ...current, state: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="city-country">Country</Label>
            <Input
              id="city-country"
              value={cityForm.country}
              onChange={(e) =>
                setCityForm((current) => ({
                  ...current,
                  country: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              disabled={saving || !cityForm.name.trim()}
              onClick={() =>
                void run(async () => {
                  await createAdminCity({
                    name: cityForm.name.trim(),
                    state: cityForm.state.trim() || undefined,
                    country: cityForm.country.trim() || undefined,
                  });
                  setCityForm({ name: "", state: "", country: "India" });
                })
              }
            >
              <PlusIcon />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
        cities.map((city) => (
          <Card key={city.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{city.name}</CardTitle>
                <CardDescription>
                  {[city.state, city.country].filter(Boolean).join(", ")}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={saving}
                onClick={() => {
                  if (
                    !window.confirm(
                      `Delete ${city.name} and all of its areas?`,
                    )
                  ) {
                    return;
                  }
                  void run(async () => {
                    await deleteAdminCity(city.id);
                  });
                }}
              >
                <Trash2Icon />
                Delete city
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label>Rename city</Label>
                  <Input
                    defaultValue={city.name}
                    onBlur={(event) => {
                      const name = event.target.value.trim();
                      if (!name || name === city.name) return;
                      void run(async () => {
                        await updateAdminCity(city.id, { name });
                      });
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Areas</p>
                <ul className="space-y-2">
                  {city.areas.map((area) => (
                    <li
                      key={area.id}
                      className="flex items-center gap-2 rounded-md border px-3 py-2"
                    >
                      <Input
                        defaultValue={area.name}
                        className="h-8"
                        onBlur={(event) => {
                          const name = event.target.value.trim();
                          if (!name || name === area.name) return;
                          void run(async () => {
                            await updateAdminArea(area.id, name);
                          });
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={saving}
                        aria-label={`Delete ${area.name}`}
                        onClick={() =>
                          void run(async () => {
                            await deleteAdminArea(area.id);
                          })
                        }
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder={`Add area in ${city.name}`}
                    value={areaDrafts[city.id] ?? ""}
                    onChange={(e) =>
                      setAreaDrafts((current) => ({
                        ...current,
                        [city.id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving || !(areaDrafts[city.id] ?? "").trim()}
                    onClick={() =>
                      void run(async () => {
                        await createAdminArea(
                          city.id,
                          (areaDrafts[city.id] ?? "").trim(),
                        );
                        setAreaDrafts((current) => ({
                          ...current,
                          [city.id]: "",
                        }));
                      })
                    }
                  >
                    Add area
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
