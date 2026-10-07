"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2Icon, RefreshCwIcon } from "lucide-react";

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
  deleteRoomTypeRates,
  fetchPropertyPricingConfig,
  fetchRatePlans,
  fetchRoomTypeRates,
  fetchRoomTypes,
  syncPropertyRatePlans,
  updatePropertyPricingConfig,
  upsertRoomTypeRates,
  type PropertyPricingConfig,
} from "@/lib/admin-api";
import {
  getProductGuestLabel,
  RATE_PRODUCT_CATALOG,
  REQUIRED_PRODUCT_CODE,
  type RateProductCode,
} from "@/lib/rate-products";
import type { RatePlan, RoomType, RoomTypeDailyRate } from "@/types/admin";

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
  const [ratesByRoomType, setRatesByRoomType] = useState<
    Record<string, RoomTypeDailyRate[]>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [expandedRoomTypeId, setExpandedRoomTypeId] = useState<string | null>(
    null,
  );

  const [priceForm, setPriceForm] = useState({
    roomTypeId: "",
    startDate: isoDate(0),
    endDate: isoDate(90),
    basePrice: "",
  });

  const [pricingConfig, setPricingConfig] = useState<PropertyPricingConfig>({
    version: 1,
    weekendDays: [5, 6],
    weekendMultiplier: 1.15,
    minNightlyPrice: null,
    maxNightlyPrice: null,
    platformFeeAmount: 262,
    breakfastUpliftPerNight: 400,
    halfBoardUpliftPerNight: 800,
    fullBoardUpliftPerNight: 1200,
    nonRefundableDiscountPercent: 10,
    enabledProductCodes: [
      "EP_REFUNDABLE",
      "EP_NON_REFUNDABLE",
      "CP_REFUNDABLE",
      "CP_NON_REFUNDABLE",
    ],
  });

  const plansByRoomType = useMemo(() => {
    const map = new Map<string, RatePlan[]>();
    for (const plan of ratePlans) {
      if (plan.status !== "ACTIVE" || !plan.productCode) continue;
      const list = map.get(plan.roomType.id) ?? [];
      list.push(plan);
      map.set(plan.roomType.id, list);
    }
    return map;
  }, [ratePlans]);

  const enabledProductCount = pricingConfig.enabledProductCodes.length;

  function toggleProduct(code: RateProductCode, checked: boolean) {
    if (code === REQUIRED_PRODUCT_CODE) return;

    setPricingConfig((current) => {
      const enabled = new Set(current.enabledProductCodes);
      if (checked) {
        enabled.add(code);
      } else {
        enabled.delete(code);
      }
      if (!enabled.has(REQUIRED_PRODUCT_CODE)) {
        enabled.add(REQUIRED_PRODUCT_CODE);
      }
      return {
        ...current,
        enabledProductCodes: RATE_PRODUCT_CATALOG
          .map((product) => product.code)
          .filter((productCode) => enabled.has(productCode)),
      };
    });
  }

  const loadData = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const [types, plans, config] = await Promise.all([
        fetchRoomTypes(propertyId),
        fetchRatePlans(propertyId),
        fetchPropertyPricingConfig(propertyId),
      ]);
      setRoomTypes(types);
      setRatePlans(plans);
      setPricingConfig(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pricing");
    } finally {
      setFetching(false);
    }
  }, [propertyId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function loadRatesForRoomType(roomTypeId: string, from?: string, to?: string) {
    const rows = await fetchRoomTypeRates(propertyId, roomTypeId, { from, to });
    setRatesByRoomType((prev) => ({ ...prev, [roomTypeId]: rows }));
  }

  async function handleSyncRatePlans() {
    setSyncing(true);
    setError(null);
    try {
      await syncPropertyRatePlans(propertyId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync rate plans");
    } finally {
      setSyncing(false);
    }
  }

  async function handleSavePricingConfig() {
    setSaving(true);
    setError(null);
    try {
      const saved = await updatePropertyPricingConfig(propertyId, {
        weekendDays: pricingConfig.weekendDays,
        weekendMultiplier: pricingConfig.weekendMultiplier,
        minNightlyPrice: pricingConfig.minNightlyPrice,
        maxNightlyPrice: pricingConfig.maxNightlyPrice,
        platformFeeAmount: pricingConfig.platformFeeAmount,
        breakfastUpliftPerNight: pricingConfig.breakfastUpliftPerNight,
        halfBoardUpliftPerNight: pricingConfig.halfBoardUpliftPerNight,
        fullBoardUpliftPerNight: pricingConfig.fullBoardUpliftPerNight,
        nonRefundableDiscountPercent: pricingConfig.nonRefundableDiscountPercent,
        enabledProductCodes: pricingConfig.enabledProductCodes,
      });
      setPricingConfig(saved);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save pricing rules",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpsertRates(roomTypeId: string) {
    if (!priceForm.basePrice) return;
    setSaving(true);
    setError(null);
    try {
      await upsertRoomTypeRates(propertyId, roomTypeId, {
        startDate: priceForm.startDate,
        endDate: priceForm.endDate,
        basePrice: Number(priceForm.basePrice),
      });
      await loadRatesForRoomType(
        roomTypeId,
        priceForm.startDate,
        priceForm.endDate,
      );
      setExpandedRoomTypeId(roomTypeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save base rates");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRates(roomTypeId: string) {
    if (!window.confirm("Delete base rates in the selected date range?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteRoomTypeRates(propertyId, roomTypeId, {
        from: priceForm.startDate,
        to: priceForm.endDate,
      });
      await loadRatesForRoomType(
        roomTypeId,
        priceForm.startDate,
        priceForm.endDate,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete rates");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRoomTypeExpand(roomTypeId: string) {
    const next = expandedRoomTypeId === roomTypeId ? null : roomTypeId;
    setExpandedRoomTypeId(next);
    if (next) {
      setPriceForm((f) => ({
        ...f,
        roomTypeId,
        startDate: f.startDate || isoDate(0),
        endDate: f.endDate || isoDate(90),
      }));
      if (!ratesByRoomType[roomTypeId]) {
        await loadRatesForRoomType(roomTypeId, isoDate(0), isoDate(90));
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
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Pricing rules</CardTitle>
            <CardDescription>
              Dynamic pricing is always on. Choose which sell products guests
              see ({enabledProductCount} active), then set base BAR once per
              room type.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={syncing}
            onClick={() => void handleSyncRatePlans()}
          >
            {syncing ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="size-4" />
            )}
            Sync products
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/20 p-4 space-y-3">
            <p className="text-sm font-medium">Sell products for this property</p>
            <p className="text-xs text-muted-foreground">
              Check the rate options guests can book. Saving applies them to
              every room type.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {RATE_PRODUCT_CATALOG.map((product) => {
                const checked = pricingConfig.enabledProductCodes.includes(
                  product.code,
                );
                return (
                  <label
                    key={product.code}
                    className="flex items-start gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={checked}
                      disabled={product.required}
                      onChange={(e) =>
                        toggleProduct(product.code, e.target.checked)
                      }
                    />
                    <span>
                      {product.guestLabel}
                      {product.required ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (required)
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>Weekend multiplier</Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                value={pricingConfig.weekendMultiplier}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    weekendMultiplier: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Breakfast uplift / night (INR)</Label>
              <Input
                type="number"
                min="0"
                value={pricingConfig.breakfastUpliftPerNight}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    breakfastUpliftPerNight: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Half board uplift / night (INR)</Label>
              <Input
                type="number"
                min="0"
                value={pricingConfig.halfBoardUpliftPerNight}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    halfBoardUpliftPerNight: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Full board uplift / night (INR)</Label>
              <Input
                type="number"
                min="0"
                value={pricingConfig.fullBoardUpliftPerNight}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    fullBoardUpliftPerNight: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Non-refundable discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={pricingConfig.nonRefundableDiscountPercent}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    nonRefundableDiscountPercent: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Platform fee (INR)</Label>
              <Input
                type="number"
                min="0"
                value={pricingConfig.platformFeeAmount}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    platformFeeAmount: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Min nightly price (optional)</Label>
              <Input
                type="number"
                min="0"
                value={pricingConfig.minNightlyPrice ?? ""}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    minNightlyPrice:
                      e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Max nightly price (optional)</Label>
              <Input
                type="number"
                min="0"
                value={pricingConfig.maxNightlyPrice ?? ""}
                onChange={(e) =>
                  setPricingConfig((c) => ({
                    ...c,
                    maxNightlyPrice:
                      e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <Button
            type="button"
            disabled={saving}
            onClick={() => void handleSavePricingConfig()}
          >
            Save pricing rules &amp; sync products
          </Button>
        </CardContent>
      </Card>

      {roomTypes.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Add a room type first. Sell products will be created automatically.
        </p>
      ) : (
        roomTypes.map((roomType) => {
          const products = plansByRoomType.get(roomType.id) ?? [];
          const rates = ratesByRoomType[roomType.id] ?? [];
          const expanded = expandedRoomTypeId === roomType.id;

          return (
            <Card key={roomType.id}>
              <CardHeader>
                <CardTitle>{roomType.name}</CardTitle>
                <CardDescription>
                  Set base BAR below. Guests see {products.length || enabledProductCount}{" "}
                  sell option{products.length === 1 ? "" : "s"} at checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {products.map((plan) => (
                      <Badge key={plan.id} variant="secondary">
                        {getProductGuestLabel(plan.productCode, plan.name)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sell products yet. Click &quot;Sync products&quot; above.
                  </p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void toggleRoomTypeExpand(roomType.id)}
                >
                  {expanded ? "Hide base rates" : "Set base BAR"}
                </Button>

                {expanded ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Base price / night (INR)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={
                            priceForm.roomTypeId === roomType.id
                              ? priceForm.basePrice
                              : ""
                          }
                          onChange={(e) =>
                            setPriceForm((f) => ({
                              ...f,
                              roomTypeId: roomType.id,
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
                            priceForm.roomTypeId === roomType.id
                              ? priceForm.startDate
                              : isoDate(0)
                          }
                          onChange={(e) =>
                            setPriceForm((f) => ({
                              ...f,
                              roomTypeId: roomType.id,
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
                            priceForm.roomTypeId === roomType.id
                              ? priceForm.endDate
                              : isoDate(90)
                          }
                          onChange={(e) =>
                            setPriceForm((f) => ({
                              ...f,
                              roomTypeId: roomType.id,
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
                            priceForm.roomTypeId !== roomType.id ||
                            !priceForm.basePrice
                          }
                          onClick={() => void handleUpsertRates(roomType.id)}
                        >
                          Save BAR
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={
                            saving || priceForm.roomTypeId !== roomType.id
                          }
                          onClick={() => void handleDeleteRates(roomType.id)}
                        >
                          Clear range
                        </Button>
                      </div>
                    </div>

                    {rates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No base rates in range. Save a date range above.
                      </p>
                    ) : (
                      <div className="max-h-64 overflow-auto rounded-md border text-sm">
                        <table className="w-full">
                          <thead className="sticky top-0 bg-muted/40 text-left">
                            <tr>
                              <th className="px-3 py-2">Date</th>
                              <th className="px-3 py-2">Base BAR</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rates.map((row) => (
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
