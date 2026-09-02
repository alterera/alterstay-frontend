"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteInventoryRange,
  fetchInventory,
  fetchRoomTypes,
  updateInventoryRow,
  upsertInventory,
} from "@/lib/admin-api";
import type { RoomInventory, RoomType } from "@/types/admin";

type InventoryPanelProps = {
  propertyId: string;
};

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function InventoryPanel({ propertyId }: InventoryPanelProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [inventory, setInventory] = useState<RoomInventory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState<RoomInventory | null>(null);
  const [editTotal, setEditTotal] = useState("");
  const [editBlocked, setEditBlocked] = useState("");

  const [filterRoomTypeId, setFilterRoomTypeId] = useState("");
  const [filterFrom, setFilterFrom] = useState(isoDate(0));
  const [filterTo, setFilterTo] = useState(isoDate(90));

  const [bulkForm, setBulkForm] = useState({
    roomTypeId: "",
    startDate: isoDate(0),
    endDate: isoDate(30),
    totalRooms: "10",
    blockedRooms: "0",
  });

  const load = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const types = await fetchRoomTypes(propertyId);
      setRoomTypes(types);
      const rows = await fetchInventory(propertyId, {
        roomTypeId: filterRoomTypeId || undefined,
        from: filterFrom,
        to: filterTo,
      });
      setInventory(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setFetching(false);
    }
  }, [propertyId, filterRoomTypeId, filterFrom, filterTo]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleBulkUpsert() {
    setSaving(true);
    setError(null);
    try {
      await upsertInventory(propertyId, {
        roomTypeId: bulkForm.roomTypeId,
        startDate: bulkForm.startDate,
        endDate: bulkForm.endDate,
        totalRooms: Number(bulkForm.totalRooms),
        blockedRooms: Number(bulkForm.blockedRooms),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save inventory");
    } finally {
      setSaving(false);
    }
  }

  function startEditRow(row: RoomInventory) {
    setEditingRow(row);
    setEditTotal(String(row.totalRooms));
    setEditBlocked(String(row.blockedRooms));
  }

  async function handleSaveRow() {
    if (!editingRow) return;
    setSaving(true);
    setError(null);
    try {
      await updateInventoryRow(propertyId, editingRow.id, {
        totalRooms: Number(editTotal),
        blockedRooms: Number(editBlocked),
      });
      setEditingRow(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update row");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRange() {
    if (!bulkForm.roomTypeId) return;
    if (
      !window.confirm(
        "Delete inventory rows in the bulk date range? Rows with sold rooms will be skipped by the server.",
      )
    ) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await deleteInventoryRange(propertyId, {
        roomTypeId: bulkForm.roomTypeId,
        from: bulkForm.startDate,
        to: bulkForm.endDate,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete inventory");
    } finally {
      setSaving(false);
    }
  }

  if (fetching && inventory.length === 0) {
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
          <h2 className="font-medium">Filters</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Availability is managed per room type and date via total rooms.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Room type</Label>
            <select
              className="h-9 w-full rounded-md border px-3 text-sm"
              value={filterRoomTypeId}
              onChange={(e) => setFilterRoomTypeId(e.target.value)}
            >
              <option value="">All types</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>From</Label>
            <Input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>To</Label>
            <Input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </div>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
      </section>

      <section className="space-y-4 rounded-lg border bg-background p-6">
        <h2 className="font-medium">Bulk set inventory</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Room type</Label>
            <select
              className="h-9 w-full rounded-md border px-3 text-sm"
              value={bulkForm.roomTypeId}
              onChange={(e) =>
                setBulkForm((f) => ({ ...f, roomTypeId: e.target.value }))
              }
            >
              <option value="">Select</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Total rooms</Label>
            <Input
              type="number"
              value={bulkForm.totalRooms}
              onChange={(e) =>
                setBulkForm((f) => ({ ...f, totalRooms: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Blocked rooms</Label>
            <Input
              type="number"
              value={bulkForm.blockedRooms}
              onChange={(e) =>
                setBulkForm((f) => ({ ...f, blockedRooms: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input
              type="date"
              value={bulkForm.startDate}
              onChange={(e) =>
                setBulkForm((f) => ({ ...f, startDate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input
              type="date"
              value={bulkForm.endDate}
              onChange={(e) =>
                setBulkForm((f) => ({ ...f, endDate: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={saving || !bulkForm.roomTypeId}
            onClick={() => void handleBulkUpsert()}
          >
            {saving ? <Loader2Icon className="animate-spin" /> : null}
            Save inventory
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={saving || !bulkForm.roomTypeId}
            onClick={() => void handleDeleteRange()}
          >
            Delete range
          </Button>
        </div>
      </section>

      {editingRow ? (
        <section className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <h3 className="font-medium">
            Edit {new Date(editingRow.date).toLocaleDateString()} —{" "}
            {editingRow.roomType.name}
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <Label>Total</Label>
              <Input
                type="number"
                className="w-28"
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Blocked</Label>
              <Input
                type="number"
                className="w-28"
                value={editBlocked}
                onChange={(e) => setEditBlocked(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="button"
                size="sm"
                disabled={saving}
                onClick={() => void handleSaveRow()}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setEditingRow(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
          {editingRow.soldRooms > 0 ? (
            <p className="text-xs text-muted-foreground">
              {editingRow.soldRooms} rooms sold — total must stay at or above sold
              + blocked.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="overflow-hidden rounded-lg border text-sm">
        {inventory.length === 0 ? (
          <p className="p-6 text-muted-foreground">
            No inventory rows in this range. Use bulk set above.
          </p>
        ) : (
          <div className="max-h-[480px] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 border-b bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Room type</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Blocked</th>
                  <th className="px-4 py-2">Sold</th>
                  <th className="px-4 py-2">Free</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {inventory.map((row) => {
                  const free =
                    row.totalRooms - row.blockedRooms - row.soldRooms;
                  return (
                    <tr key={row.id} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(row.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{row.roomType.name}</td>
                      <td className="px-4 py-2">{row.totalRooms}</td>
                      <td className="px-4 py-2">{row.blockedRooms}</td>
                      <td className="px-4 py-2">{row.soldRooms}</td>
                      <td className="px-4 py-2">{free}</td>
                      <td className="px-4 py-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit row"
                          onClick={() => startEditRow(row)}
                        >
                          <PencilIcon className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
