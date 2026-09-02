"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createRoomType,
  deleteRoomType,
  fetchRoomTypes,
  updateRoomType,
} from "@/lib/admin-api";
import type { RoomType } from "@/types/admin";

type RoomTypesPanelProps = {
  propertyId: string;
};

function emptyForm() {
  return {
    name: "",
    maxAdults: "2",
    maxChildren: "0",
    maxOccupancy: "2",
    bedType: "",
    status: "ACTIVE",
  };
}

export function RoomTypesPanel({ propertyId }: RoomTypesPanelProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setFetching(true);
    try {
      setRoomTypes(await fetchRoomTypes(propertyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room types");
    } finally {
      setFetching(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      await createRoomType(propertyId, {
        name: createForm.name,
        maxAdults: Number(createForm.maxAdults),
        maxChildren: Number(createForm.maxChildren),
        maxOccupancy: Number(createForm.maxOccupancy),
        bedType: createForm.bedType || undefined,
      });
      setCreateForm(emptyForm());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room type");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(rt: RoomType) {
    setEditing(rt);
    setEditForm({
      name: rt.name,
      maxAdults: String(rt.maxAdults),
      maxChildren: String(rt.maxChildren),
      maxOccupancy: String(rt.maxOccupancy),
      bedType: rt.bedType ?? "",
      status: rt.status,
    });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await updateRoomType(propertyId, editing.id, {
        name: editForm.name,
        maxAdults: Number(editForm.maxAdults),
        maxChildren: Number(editForm.maxChildren),
        maxOccupancy: Number(editForm.maxOccupancy),
        bedType: editForm.bedType || undefined,
        status: editForm.status,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update room type");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(rt: RoomType) {
    if (
      !window.confirm(
        `Delete "${rt.name}"? This cannot be undone if the room type has no booking history.`,
      )
    ) {
      return;
    }
    setDeletingId(rt.id);
    setError(null);
    try {
      await deleteRoomType(propertyId, rt.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete room type");
    } finally {
      setDeletingId(null);
    }
  }

  if (fetching) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="space-y-4 rounded-lg border bg-background p-6">
        <div>
          <h2 className="font-medium">Room types</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sellable room categories. Set nightly availability under Inventory and
            prices under Pricing.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Name (e.g. Deluxe)"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            placeholder="Max adults"
            type="number"
            value={createForm.maxAdults}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, maxAdults: e.target.value }))
            }
          />
          <Input
            placeholder="Max occupancy"
            type="number"
            value={createForm.maxOccupancy}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, maxOccupancy: e.target.value }))
            }
          />
          <Input
            placeholder="Bed type"
            value={createForm.bedType}
            onChange={(e) =>
              setCreateForm((f) => ({ ...f, bedType: e.target.value }))
            }
          />
        </div>
        <Button
          type="button"
          disabled={saving || !createForm.name}
          onClick={() => void handleCreate()}
        >
          {saving ? <Loader2Icon className="animate-spin" /> : null}
          Add room type
        </Button>

        {roomTypes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No room types yet. Add one to configure inventory and pricing.
          </p>
        ) : (
          <ul className="divide-y rounded-md border text-sm">
            {roomTypes.map((rt) => (
              <li
                key={rt.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {rt.name}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({rt.status})
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Sleeps {rt.maxOccupancy} · {rt._count?.ratePlans ?? 0} rate
                    plans
                    {(rt._count?.reservationItems ?? 0) > 0
                      ? ` · ${rt._count?.reservationItems} bookings`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit"
                    onClick={() => startEdit(rt)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete"
                    disabled={deletingId === rt.id}
                    onClick={() => void handleDelete(rt)}
                  >
                    {deletingId === rt.id ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="size-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing ? (
        <section className="space-y-4 rounded-lg border bg-muted/30 p-6">
          <h3 className="font-medium">Edit {editing.name}</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max adults</Label>
              <Input
                type="number"
                value={editForm.maxAdults}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, maxAdults: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max children</Label>
              <Input
                type="number"
                value={editForm.maxChildren}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, maxChildren: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max occupancy</Label>
              <Input
                type="number"
                value={editForm.maxOccupancy}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, maxOccupancy: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bed type</Label>
              <Input
                value={editForm.bedType}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, bedType: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="h-9 w-full rounded-md border px-3 text-sm"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={saving}
              onClick={() => void handleSaveEdit()}
            >
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
