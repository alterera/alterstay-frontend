"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  updatePropertyAmenities,
  updatePropertyPolicies,
  updatePropertyRestrictions,
} from "@/lib/admin-api";
import type { Amenity, Property, Restriction } from "@/types/admin";

type PolicyDraft = {
  policyType: string;
  title: string;
  description: string;
};

type PropertyContentPanelProps = {
  property: Property;
  amenities: Amenity[];
  restrictions: Restriction[];
  onSaved: (property: Property) => void;
};

function SelectionPills({
  items,
  selectedIds,
  onToggle,
}: {
  items: { id: string; label: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No catalog items yet. Add them from the admin catalog API.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = selectedIds.includes(item.id);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              selected
                ? "border-brand bg-brand/10 text-brand"
                : "border-border bg-white hover:bg-muted/40"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function PropertyContentPanel({
  property,
  amenities,
  restrictions,
  onSaved,
}: PropertyContentPanelProps) {
  const perkCatalog = useMemo(
    () => amenities.filter((a) => a.category?.toUpperCase() === "PERK"),
    [amenities],
  );
  const amenityCatalog = useMemo(
    () => amenities.filter((a) => a.category?.toUpperCase() !== "PERK"),
    [amenities],
  );

  const initialAmenityIds = property.amenities.map((a) => a.amenity.id);
  const [perkIds, setPerkIds] = useState<string[]>(() =>
    initialAmenityIds.filter((id) =>
      perkCatalog.some((perk) => perk.id === id),
    ),
  );
  const [amenityIds, setAmenityIds] = useState<string[]>(() =>
    initialAmenityIds.filter((id) =>
      amenityCatalog.some((amenity) => amenity.id === id),
    ),
  );
  const [restrictionIds, setRestrictionIds] = useState<string[]>(
    () => property.restrictions?.map((r) => r.restriction.id) ?? [],
  );
  const [policies, setPolicies] = useState<PolicyDraft[]>(() =>
    property.policies.map((policy) => ({
      policyType: policy.policyType,
      title: policy.title,
      description: policy.description ?? "",
    })),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = property.amenities.map((a) => a.amenity.id);
    setPerkIds(ids.filter((id) => perkCatalog.some((perk) => perk.id === id)));
    setAmenityIds(
      ids.filter((id) => amenityCatalog.some((amenity) => amenity.id === id)),
    );
    setRestrictionIds(
      property.restrictions?.map((r) => r.restriction.id) ?? [],
    );
    setPolicies(
      property.policies.map((policy) => ({
        policyType: policy.policyType,
        title: policy.title,
        description: policy.description ?? "",
      })),
    );
  }, [property, perkCatalog, amenityCatalog]);

  function toggleId(ids: string[], id: string, setter: (next: string[]) => void) {
    setter(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const mergedAmenityIds = [...new Set([...perkIds, ...amenityIds])];
      await updatePropertyAmenities(property.id, mergedAmenityIds);
      await updatePropertyPolicies(
        property.id,
        policies.map((policy) => ({
          policyType: policy.policyType.trim(),
          title: policy.title.trim(),
          description: policy.description.trim() || undefined,
        })),
      );
      const updated = await updatePropertyRestrictions(
        property.id,
        restrictionIds,
      );
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Perks</h3>
          <p className="text-sm text-muted-foreground">
            Highlight special facilities shown in the Perks section on the property page.
          </p>
        </div>
        <SelectionPills
          items={perkCatalog.map((a) => ({ id: a.id, label: a.name }))}
          selectedIds={perkIds}
          onToggle={(id) => toggleId(perkIds, id, setPerkIds)}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Amenities</h3>
          <p className="text-sm text-muted-foreground">
            Standard facilities shown under Amenities on the property page.
          </p>
        </div>
        <SelectionPills
          items={amenityCatalog.map((a) => ({ id: a.id, label: a.name }))}
          selectedIds={amenityIds}
          onToggle={(id) => toggleId(amenityIds, id, setAmenityIds)}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Policies</h3>
            <p className="text-sm text-muted-foreground">
              Guest-facing rules under &quot;What you must know&quot;.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPolicies((current) => [
                ...current,
                { policyType: "GENERAL", title: "", description: "" },
              ])
            }
          >
            <PlusIcon className="size-4" />
            Add policy
          </Button>
        </div>

        <div className="space-y-3">
          {policies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No policies added yet.</p>
          ) : (
            policies.map((policy, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[160px_1fr_1fr_auto]"
              >
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Input
                    value={policy.policyType}
                    onChange={(e) =>
                      setPolicies((current) =>
                        current.map((row, i) =>
                          i === index
                            ? { ...row, policyType: e.target.value }
                            : row,
                        ),
                      )
                    }
                    placeholder="CHECK_IN"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    value={policy.title}
                    onChange={(e) =>
                      setPolicies((current) =>
                        current.map((row, i) =>
                          i === index ? { ...row, title: e.target.value } : row,
                        ),
                      )
                    }
                    placeholder="Valid ID required"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    value={policy.description}
                    onChange={(e) =>
                      setPolicies((current) =>
                        current.map((row, i) =>
                          i === index
                            ? { ...row, description: e.target.value }
                            : row,
                        ),
                      )
                    }
                    placeholder="Optional details"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setPolicies((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    aria-label="Remove policy"
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold">Restrictions</h3>
          <p className="text-sm text-muted-foreground">
            Rules shown under &quot;What to follow&quot; on the property page.
          </p>
        </div>
        <SelectionPills
          items={restrictions.map((r) => ({ id: r.id, label: r.label }))}
          selectedIds={restrictionIds}
          onToggle={(id) => toggleId(restrictionIds, id, setRestrictionIds)}
        />
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="button" disabled={saving} onClick={() => void handleSave()}>
        {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
        Save content
      </Button>
    </div>
  );
}
