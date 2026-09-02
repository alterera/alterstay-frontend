"use client";

import { InventoryPanel } from "@/components/admin/property/inventory-panel";
import { PricingPanel } from "@/components/admin/property/pricing-panel";
import { RoomTypesPanel } from "@/components/admin/property/room-types-panel";

type PropertyCatalogPanelsProps = {
  propertyId: string;
  tab: "rooms" | "inventory" | "pricing";
};

export function PropertyCatalogPanels({
  propertyId,
  tab,
}: PropertyCatalogPanelsProps) {
  if (tab === "rooms") {
    return <RoomTypesPanel propertyId={propertyId} />;
  }
  if (tab === "inventory") {
    return <InventoryPanel propertyId={propertyId} />;
  }
  return <PricingPanel propertyId={propertyId} />;
}
