"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2Icon, PencilIcon, Trash2Icon } from "lucide-react";

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
  deleteRatePlan,
  deleteRatePrices,
  fetchCancellationPolicies,
  fetchMealPlans,
  fetchRatePlans,
  fetchRatePrices,
  fetchRoomTypes,
  updateRatePlan,
  upsertRatePrices,
} from "@/lib/admin-api";
import type {
  CancellationPolicy,
  MealPlan,
  RatePlan,
  RatePrice,
  RoomType,
} from "@/types/admin";

type PricingPanelProps = {
  propertyId: string;
};

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

export function PricingPanel({ propertyId }: PricingPanelProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [policies, setPolicies] = useState<CancellationPolicy[]>([]);
  const [pricesByPlan, setPricesByPlan] = useState<Record<string, RatePrice[]>>(
    {},
  );
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const [planForm, setPlanForm] = useState({
    roomTypeId: "",
    name: "",
    description: "",
    mealPlanId: "",
    cancellationPolicyId: "",
  });

  const [priceForm, setPriceForm] = useState({
    ratePlanId: "",
    startDate: isoDate(0),
    endDate: isoDate(90),
    basePrice: "",
  });

  const [editPlan, setEditPlan] = useState<RatePlan | null>(null);
  const [editPlanForm, setEditPlanForm] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
  });

  const loadPlans = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const [types, plans, meals, cancels] = await Promise.all([
        fetchRoomTypes(propertyId),
        fetchRatePlans(propertyId),
        fetchMealPlans(),
        fetchCancellationPolicies(),
      ]);
      setRoomTypes(types);
      setRatePlans(plans);
      setMealPlans(meals);
      setPolicies(cancels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pricing");
    } finally {
      setFetching(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  async function loadPricesForPlan(planId: string, from?: string, to?: string) {
    const rows = await fetchRatePrices(propertyId, planId, { from, to });
    setPricesByPlan((prev) => ({ ...prev, [planId]: rows }));
  }

  async function handleCreatePlan() {
    setSaving(true);
    setError(null);
    try {
      await createRatePlan(propertyId, {
        roomTypeId: planForm.roomTypeId,
        name: planForm.name,
        description: planForm.description || undefined,
        mealPlanId: planForm.mealPlanId || undefined,
        cancellationPolicyId: planForm.cancellationPolicyId || undefined,
      });
      setPlanForm({
        roomTypeId: planForm.roomTypeId,
        name: "",
        description: "",
        mealPlanId: "",
        cancellationPolicyId: "",
      });
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create rate plan");
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePlanEdit() {
    if (!editPlan) return;
    setSaving(true);
    setError(null);
    try {
      await updateRatePlan(propertyId, editPlan.id, editPlanForm);
      setEditPlan(null);
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update plan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePlan(plan: RatePlan) {
    if (
      !window.confirm(
        `Delete rate plan "${plan.name}"? Blocked if bookings exist.`,
      )
    ) {
      return;
    }
    setDeletingPlanId(plan.id);
    setError(null);
    try {
      await deleteRatePlan(propertyId, plan.id);
      await loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    } finally {
      setDeletingPlanId(null);
    }
  }

  async function handleUpsertPrices() {
    if (!priceForm.ratePlanId || !priceForm.basePrice) return;
    setSaving(true);
    setError(null);
    try {
      await upsertRatePrices(propertyId, priceForm.ratePlanId, {
        startDate: priceForm.startDate,
        endDate: priceForm.endDate,
        basePrice: Number(priceForm.basePrice),
      });
      await loadPricesForPlan(
        priceForm.ratePlanId,
        priceForm.startDate,
        priceForm.endDate,
      );
      setExpandedPlanId(priceForm.ratePlanId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save prices");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePrices(planId: string) {
    if (!window.confirm("Delete prices in the selected date range?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteRatePrices(propertyId, planId, {
        from: priceForm.startDate,
        to: priceForm.endDate,
      });
      await loadPricesForPlan(planId, priceForm.startDate, priceForm.endDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete prices");
    } finally {
      setSaving(false);
    }
  }

  async function togglePlanExpand(plan: RatePlan) {
    const next = expandedPlanId === plan.id ? null : plan.id;
    setExpandedPlanId(next);
    if (next) {
      setPriceForm((f) => ({
        ...f,
        ratePlanId: plan.id,
        startDate: f.startDate || isoDate(0),
        endDate: f.endDate || isoDate(90),
      }));
      if (!pricesByPlan[plan.id]) {
        await loadPricesForPlan(plan.id, isoDate(0), isoDate(90));
      }
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

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create rate plan</CardTitle>
          <CardDescription>
            A rate plan links a room type to meal and cancellation rules. Set
            nightly prices on each plan below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="h-9 rounded-md border px-3 text-sm"
              value={planForm.roomTypeId}
              onChange={(e) =>
                setPlanForm((f) => ({ ...f, roomTypeId: e.target.value }))
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
              value={planForm.name}
              onChange={(e) =>
                setPlanForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <Input
              placeholder="Description (optional)"
              value={planForm.description}
              onChange={(e) =>
                setPlanForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <select
              className="h-9 rounded-md border px-3 text-sm"
              value={planForm.mealPlanId}
              onChange={(e) =>
                setPlanForm((f) => ({ ...f, mealPlanId: e.target.value }))
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
              className="h-9 rounded-md border px-3 text-sm sm:col-span-2"
              value={planForm.cancellationPolicyId}
              onChange={(e) =>
                setPlanForm((f) => ({
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
            disabled={saving || !planForm.roomTypeId || !planForm.name}
            onClick={() => void handleCreatePlan()}
          >
            {saving ? <Loader2Icon className="animate-spin" /> : null}
            Add rate plan
          </Button>
        </CardContent>
      </Card>

      {editPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit {editPlan.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={editPlanForm.name}
              onChange={(e) =>
                setEditPlanForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <Input
              placeholder="Description"
              value={editPlanForm.description}
              onChange={(e) =>
                setEditPlanForm((f) => ({ ...f, description: e.target.value }))
              }
            />
            <select
              className="h-9 w-full rounded-md border px-3 text-sm"
              value={editPlanForm.status}
              onChange={(e) =>
                setEditPlanForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={saving}
                onClick={() => void handleSavePlanEdit()}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditPlan(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {ratePlans.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No rate plans yet. Create one to set nightly prices for search and
          booking.
        </p>
      ) : (
        ratePlans.map((plan) => {
          const prices = pricesByPlan[plan.id] ?? [];
          const expanded = expandedPlanId === plan.id;
          return (
            <Card key={plan.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.roomType.name}
                    {plan.mealPlan ? ` · ${plan.mealPlan.name}` : ""} ·{" "}
                    {plan.status}
                    {(plan._count?.reservationItems ?? 0) > 0
                      ? ` · ${plan._count?.reservationItems} bookings`
                      : ""}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={plan._count?.prices ? "success" : "warning"}>
                    {plan._count?.prices ?? 0} priced nights
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit plan"
                    onClick={() => {
                      setEditPlan(plan);
                      setEditPlanForm({
                        name: plan.name,
                        description: plan.description ?? "",
                        status: plan.status,
                      });
                    }}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete plan"
                    disabled={deletingPlanId === plan.id}
                    onClick={() => void handleDeletePlan(plan)}
                  >
                    {deletingPlanId === plan.id ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <Trash2Icon className="size-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void togglePlanExpand(plan)}
                >
                  {expanded ? "Hide prices" : "Manage prices"}
                </Button>

                {expanded ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Nightly price (INR)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={
                            priceForm.ratePlanId === plan.id
                              ? priceForm.basePrice
                              : ""
                          }
                          onChange={(e) =>
                            setPriceForm((f) => ({
                              ...f,
                              ratePlanId: plan.id,
                              basePrice: e.target.value,
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
                      <div className="flex flex-wrap items-end gap-2">
                        <Button
                          type="button"
                          disabled={
                            saving ||
                            priceForm.ratePlanId !== plan.id ||
                            !priceForm.basePrice
                          }
                          onClick={() => void handleUpsertPrices()}
                        >
                          Save prices
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={saving || priceForm.ratePlanId !== plan.id}
                          onClick={() => void handleDeletePrices(plan.id)}
                        >
                          Clear range
                        </Button>
                      </div>
                    </div>

                    {prices.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No prices in the loaded range. Save a date range above.
                      </p>
                    ) : (
                      <div className="max-h-64 overflow-auto rounded-md border text-sm">
                        <table className="w-full">
                          <thead className="sticky top-0 bg-muted/40 text-left">
                            <tr>
                              <th className="px-3 py-2">Date</th>
                              <th className="px-3 py-2">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prices.map((row) => (
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
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
