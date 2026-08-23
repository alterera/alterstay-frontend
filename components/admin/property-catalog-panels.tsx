"use client";

import { useEffect, useState } from "react";

import { Loader2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
  createRatePlan,
  createRoom,
  createRoomType,
  deleteRoomType,
  fetchCancellationPolicies,
  fetchInventory,
  fetchMealPlans,
  fetchRatePlans,
  fetchRoomTypes,
  fetchRooms,
  upsertInventory,
  upsertRatePrices,
} from "@/lib/admin-api";
import type {
  CancellationPolicy,
  MealPlan,
  RatePlan,
  Room,
  RoomInventory,
  RoomType,
} from "@/types/admin";

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function formatInr(value: string | number) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}

type PropertyCatalogPanelsProps = {
  propertyId: string;
  tab: "rooms" | "inventory" | "pricing";
};

export function PropertyCatalogPanels({
  propertyId,
  tab,
}: PropertyCatalogPanelsProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [inventory, setInventory] = useState<RoomInventory[]>([]);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [policies, setPolicies] = useState<CancellationPolicy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [roomTypeForm, setRoomTypeForm] = useState({
    name: "",
    maxAdults: "2",
    maxOccupancy: "2",
    bedType: "",
  });
  const [roomForm, setRoomForm] = useState({
    roomTypeId: "",
    roomNumber: "",
    floor: "",
  });
  const [inventoryForm, setInventoryForm] = useState({
    roomTypeId: "",
    startDate: "",
    endDate: "",
    totalRooms: "10",
    blockedRooms: "0",
  });
  const [ratePlanForm, setRatePlanForm] = useState({
    roomTypeId: "",
    name: "",
    mealPlanId: "",
    cancellationPolicyId: "",
  });
  const [priceForm, setPriceForm] = useState({
    ratePlanId: "",
    startDate: isoDate(0),
    endDate: isoDate(90),
    basePrice: "",
  });

  useEffect(() => {
    async function load() {
      setFetching(true);
      try {
        const types = await fetchRoomTypes(propertyId);
        setRoomTypes(types);
        if (tab === "rooms") {
          setRooms(await fetchRooms(propertyId));
        }
        if (tab === "inventory") {
          setInventory(await fetchInventory(propertyId));
        }
        if (tab === "pricing") {
          const [plans, meals, cancels] = await Promise.all([
            fetchRatePlans(propertyId),
            fetchMealPlans(),
            fetchCancellationPolicies(),
          ]);
          setRatePlans(plans);
          setMealPlans(meals);
          setPolicies(cancels);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setFetching(false);
      }
    }
    void load();
  }, [propertyId, tab]);

  async function handleCreateRoomType() {
    setLoading(true);
    setError(null);
    try {
      await createRoomType(propertyId, {
        name: roomTypeForm.name,
        maxAdults: Number(roomTypeForm.maxAdults),
        maxOccupancy: Number(roomTypeForm.maxOccupancy),
        bedType: roomTypeForm.bedType || undefined,
      });
      setRoomTypes(await fetchRoomTypes(propertyId));
      setRoomTypeForm({ name: "", maxAdults: "2", maxOccupancy: "2", bedType: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRoom() {
    setLoading(true);
    setError(null);
    try {
      await createRoom(propertyId, roomForm);
      setRooms(await fetchRooms(propertyId));
      setRoomForm({ roomTypeId: roomForm.roomTypeId, roomNumber: "", floor: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpsertInventory() {
    setLoading(true);
    setError(null);
    try {
      await upsertInventory(propertyId, {
        roomTypeId: inventoryForm.roomTypeId,
        startDate: inventoryForm.startDate,
        endDate: inventoryForm.endDate,
        totalRooms: Number(inventoryForm.totalRooms),
        blockedRooms: Number(inventoryForm.blockedRooms),
      });
      setInventory(await fetchInventory(propertyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRatePlan() {
    setLoading(true);
    setError(null);
    try {
      await createRatePlan(propertyId, {
        roomTypeId: ratePlanForm.roomTypeId,
        name: ratePlanForm.name,
        mealPlanId: ratePlanForm.mealPlanId || undefined,
        cancellationPolicyId: ratePlanForm.cancellationPolicyId || undefined,
      });
      setRatePlans(await fetchRatePlans(propertyId));
      setRatePlanForm({
        roomTypeId: ratePlanForm.roomTypeId,
        name: "",
        mealPlanId: "",
        cancellationPolicyId: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpsertPrices() {
    setLoading(true);
    setError(null);
    try {
      await upsertRatePrices(propertyId, {
        ratePlanId: priceForm.ratePlanId,
        startDate: priceForm.startDate,
        endDate: priceForm.endDate,
        basePrice: Number(priceForm.basePrice),
      });
      setRatePlans(await fetchRatePlans(propertyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (tab === "rooms") {
    return (
      <div className="space-y-8">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <section className="space-y-4 rounded-lg border bg-background p-6">
          <h2 className="font-medium">Room types</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <Input
              placeholder="Name (e.g. Deluxe)"
              value={roomTypeForm.name}
              onChange={(e) =>
                setRoomTypeForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <Input
              placeholder="Max adults"
              type="number"
              value={roomTypeForm.maxAdults}
              onChange={(e) =>
                setRoomTypeForm((f) => ({ ...f, maxAdults: e.target.value }))
              }
            />
            <Input
              placeholder="Max occupancy"
              type="number"
              value={roomTypeForm.maxOccupancy}
              onChange={(e) =>
                setRoomTypeForm((f) => ({ ...f, maxOccupancy: e.target.value }))
              }
            />
            <Input
              placeholder="Bed type"
              value={roomTypeForm.bedType}
              onChange={(e) =>
                setRoomTypeForm((f) => ({ ...f, bedType: e.target.value }))
              }
            />
          </div>
          <Button
            type="button"
            disabled={loading || !roomTypeForm.name}
            onClick={() => void handleCreateRoomType()}
          >
            {loading ? <Loader2Icon className="animate-spin" /> : null}
            Add room type
          </Button>
          <ul className="divide-y rounded-md border text-sm">
            {roomTypes.map((rt) => (
              <li
                key={rt.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium">{rt.name}</p>
                  <p className="text-muted-foreground">
                    Sleeps {rt.maxOccupancy} · {rt._count?.rooms ?? 0} rooms
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await deleteRoomType(propertyId, rt.id);
                    setRoomTypes(await fetchRoomTypes(propertyId));
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-lg border bg-background p-6">
          <h2 className="font-medium">Physical rooms</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              className="h-9 rounded-md border px-3 text-sm"
              value={roomForm.roomTypeId}
              onChange={(e) =>
                setRoomForm((f) => ({ ...f, roomTypeId: e.target.value }))
              }
            >
              <option value="">Room type</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Room number"
              value={roomForm.roomNumber}
              onChange={(e) =>
                setRoomForm((f) => ({ ...f, roomNumber: e.target.value }))
              }
            />
            <Input
              placeholder="Floor"
              value={roomForm.floor}
              onChange={(e) =>
                setRoomForm((f) => ({ ...f, floor: e.target.value }))
              }
            />
          </div>
          <Button
            type="button"
            disabled={loading || !roomForm.roomTypeId || !roomForm.roomNumber}
            onClick={() => void handleCreateRoom()}
          >
            {loading ? <Loader2Icon className="animate-spin" /> : null}
            Add room
          </Button>
          <ul className="divide-y rounded-md border text-sm">
            {rooms.map((room) => (
              <li key={room.id} className="px-4 py-3">
                <span className="font-medium">{room.roomNumber}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {room.roomType.name}
                  {room.floor ? ` · Floor ${room.floor}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  if (tab === "inventory") {
    return (
      <div className="space-y-6">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <section className="space-y-4 rounded-lg border bg-background p-6">
          <h2 className="font-medium">Set inventory</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Room type</Label>
              <select
                className="h-9 w-full rounded-md border px-3 text-sm"
                value={inventoryForm.roomTypeId}
                onChange={(e) =>
                  setInventoryForm((f) => ({ ...f, roomTypeId: e.target.value }))
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
                value={inventoryForm.totalRooms}
                onChange={(e) =>
                  setInventoryForm((f) => ({ ...f, totalRooms: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input
                type="date"
                value={inventoryForm.startDate}
                onChange={(e) =>
                  setInventoryForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End date</Label>
              <Input
                type="date"
                value={inventoryForm.endDate}
                onChange={(e) =>
                  setInventoryForm((f) => ({ ...f, endDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Blocked rooms</Label>
              <Input
                type="number"
                value={inventoryForm.blockedRooms}
                onChange={(e) =>
                  setInventoryForm((f) => ({ ...f, blockedRooms: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            type="button"
            disabled={loading || !inventoryForm.roomTypeId}
            onClick={() => void handleUpsertInventory()}
          >
            {loading ? <Loader2Icon className="animate-spin" /> : null}
            Save inventory
          </Button>
        </section>

        <section className="overflow-hidden rounded-lg border text-sm">
          <table className="w-full">
            <thead className="border-b bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Room type</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Blocked</th>
                <th className="px-4 py-2">Sold</th>
              </tr>
            </thead>
            <tbody>
              {inventory.slice(0, 50).map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{row.roomType.name}</td>
                  <td className="px-4 py-2">{row.totalRooms}</td>
                  <td className="px-4 py-2">{row.blockedRooms}</td>
                  <td className="px-4 py-2">{row.soldRooms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Rate plans</CardTitle>
          <CardDescription>
            A rate plan is a room type plus meal and cancellation rules. Set a
            nightly price on each plan below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="h-9 rounded-md border px-3 text-sm"
              value={ratePlanForm.roomTypeId}
              onChange={(e) =>
                setRatePlanForm((f) => ({ ...f, roomTypeId: e.target.value }))
              }
            >
              <option value="">Room type</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Plan name"
              value={ratePlanForm.name}
              onChange={(e) =>
                setRatePlanForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <select
              className="h-9 rounded-md border px-3 text-sm"
              value={ratePlanForm.mealPlanId}
              onChange={(e) =>
                setRatePlanForm((f) => ({ ...f, mealPlanId: e.target.value }))
              }
            >
              <option value="">Meal plan (optional)</option>
              {mealPlans.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              className="h-9 rounded-md border px-3 text-sm"
              value={ratePlanForm.cancellationPolicyId}
              onChange={(e) =>
                setRatePlanForm((f) => ({
                  ...f,
                  cancellationPolicyId: e.target.value,
                }))
              }
            >
              <option value="">Cancellation policy (optional)</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            disabled={loading || !ratePlanForm.roomTypeId || !ratePlanForm.name}
            onClick={() => void handleCreateRatePlan()}
          >
            {loading ? <Loader2Icon className="animate-spin" /> : null}
            Add rate plan
          </Button>
        </CardContent>
      </Card>

      {ratePlans.map((plan) => {
        const current = plan.prices[0];
        return (
          <Card key={plan.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  {plan.roomType.name}
                  {plan.mealPlan ? ` · ${plan.mealPlan.name}` : ""}
                </CardDescription>
              </div>
              <Badge variant={current ? "success" : "warning"}>
                {current
                  ? `${formatInr(current.basePrice)} / night`
                  : "No price set"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>Nightly price (INR)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 4500"
                    value={
                      priceForm.ratePlanId === plan.id
                        ? priceForm.basePrice
                        : current?.basePrice ?? ""
                    }
                    onChange={(e) =>
                      setPriceForm((f) => ({
                        ...f,
                        ratePlanId: plan.id,
                        basePrice: e.target.value,
                        startDate: f.startDate || isoDate(0),
                        endDate: f.endDate || isoDate(90),
                      }))
                    }
                    onFocus={() =>
                      setPriceForm((f) => ({
                        ...f,
                        ratePlanId: plan.id,
                        basePrice:
                          f.ratePlanId === plan.id
                            ? f.basePrice
                            : (current?.basePrice ?? f.basePrice),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    type="date"
                    value={
                      priceForm.ratePlanId === plan.id
                        ? priceForm.startDate
                        : isoDate(0)
                    }
                    onChange={(e) =>
                      setPriceForm((f) => ({
                        ...f,
                        ratePlanId: plan.id,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    type="date"
                    value={
                      priceForm.ratePlanId === plan.id
                        ? priceForm.endDate
                        : isoDate(90)
                    }
                    onChange={(e) =>
                      setPriceForm((f) => ({
                        ...f,
                        ratePlanId: plan.id,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    disabled={
                      loading ||
                      priceForm.ratePlanId !== plan.id ||
                      !priceForm.basePrice
                    }
                    onClick={() => void handleUpsertPrices()}
                  >
                    {loading && priceForm.ratePlanId === plan.id ? (
                      <Loader2Icon className="animate-spin" />
                    ) : null}
                    Save price
                  </Button>
                </div>
              </div>
              {plan.prices.length ? (
                <div className="overflow-x-auto rounded-md border text-sm">
                  <table className="w-full">
                    <thead className="bg-muted/40 text-left">
                      <tr>
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.prices.slice(0, 14).map((row) => (
                        <tr key={row.id} className="border-t">
                          <td className="px-3 py-2">
                            {new Date(row.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2">
                            {formatInr(row.basePrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Set a date range and nightly rate, then save. That price is
                  what search and booking use.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
