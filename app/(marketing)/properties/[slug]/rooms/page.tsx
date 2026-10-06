import { PropertyRoomSelectionPage } from "@/components/property/property-room-selection-page";

type PropertyRoomsRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function PropertyRoomsRoute({
  params,
}: PropertyRoomsRouteProps) {
  const { slug } = await params;
  return <PropertyRoomSelectionPage slug={slug} />;
}
