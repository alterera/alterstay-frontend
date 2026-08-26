import type { AuthResponse } from "@/types/auth";
import type {
  AdminArea,
  AdminBooking,
  AdminCity,
  Amenity,
  CancellationPolicy,
  MealPlan,
  Property,
  PropertyImage,
  PropertyListItem,
  PropertyType,
  RatePlan,
  Room,
  RoomInventory,
  RoomType,
  SearchResult,
} from "@/types/admin";
import { getAccessToken, getRefreshToken, setTokens } from "@/lib/auth-storage";
import { getApiBase, refreshSession } from "@/lib/auth-api";

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (body.message) return body.message;
  } catch {
    // ignore
  }
  return response.statusText || "Request failed";
}

async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await adminFetchResponse(path, init);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<T>;
}

async function adminFetchResponse(
  path: string,
  init: RequestInit,
  allowRefresh = true,
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiBase()}${path}`, { ...init, headers });

  if (response.status === 401 && allowRefresh && getRefreshToken()) {
    try {
      await refreshSession();
    } catch {
      return response;
    }
    return adminFetchResponse(path, init, false);
  }

  return response;
}

export async function adminLogin(input: {
  phone: string;
  countryCode?: string;
  password: string;
}) {
  const result = await adminFetch<AuthResponse>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setTokens(result.accessToken, result.refreshToken);
  return result;
}

export function fetchPropertyTypes() {
  return adminFetch<PropertyType[]>("/admin/property-types");
}

export function fetchAmenities() {
  return adminFetch<Amenity[]>("/admin/amenities");
}

export function fetchMealPlans() {
  return adminFetch<MealPlan[]>("/admin/meal-plans");
}

export function fetchCancellationPolicies() {
  return adminFetch<CancellationPolicy[]>("/admin/cancellation-policies");
}

export function fetchProperties() {
  return adminFetch<PropertyListItem[]>("/admin/properties");
}

export function fetchProperty(id: string) {
  return adminFetch<Property>(`/admin/properties/${id}`);
}

export function createProperty(data: Record<string, unknown>) {
  return adminFetch<Property>("/admin/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProperty(id: string, data: Record<string, unknown>) {
  return adminFetch<Property>(`/admin/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function updatePropertyStatus(id: string, status: string) {
  return adminFetch<Property>(`/admin/properties/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updatePropertyAmenities(id: string, amenityIds: string[]) {
  return adminFetch<Property>(`/admin/properties/${id}/amenities`, {
    method: "PUT",
    body: JSON.stringify({ amenityIds }),
  });
}

export function updatePropertyPolicies(
  id: string,
  policies: { policyType: string; title: string; description?: string }[],
) {
  return adminFetch<Property>(`/admin/properties/${id}/policies`, {
    method: "PUT",
    body: JSON.stringify({ policies }),
  });
}

export function uploadPropertyImage(propertyId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return adminFetch<PropertyImage>(`/admin/properties/${propertyId}/images`, {
    method: "POST",
    body: form,
  });
}

export function deletePropertyImage(propertyId: string, imageId: string) {
  return adminFetch<{ success: boolean }>(
    `/admin/properties/${propertyId}/images/${imageId}`,
    { method: "DELETE" },
  );
}

export function fetchRoomTypes(propertyId: string) {
  return adminFetch<RoomType[]>(
    `/admin/properties/${propertyId}/room-types`,
  );
}

export function createRoomType(propertyId: string, data: Record<string, unknown>) {
  return adminFetch<RoomType>(`/admin/properties/${propertyId}/room-types`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteRoomType(propertyId: string, roomTypeId: string) {
  return adminFetch<{ success: boolean }>(
    `/admin/properties/${propertyId}/room-types/${roomTypeId}`,
    { method: "DELETE" },
  );
}

export function fetchRooms(propertyId: string) {
  return adminFetch<Room[]>(`/admin/properties/${propertyId}/rooms`);
}

export function createRoom(propertyId: string, data: Record<string, unknown>) {
  return adminFetch<Room>(`/admin/properties/${propertyId}/rooms`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchInventory(propertyId: string) {
  return adminFetch<RoomInventory[]>(
    `/admin/properties/${propertyId}/inventory`,
  );
}

export function upsertInventory(propertyId: string, data: Record<string, unknown>) {
  return adminFetch<RoomInventory[]>(
    `/admin/properties/${propertyId}/inventory`,
    { method: "POST", body: JSON.stringify(data) },
  );
}

export function fetchRatePlans(propertyId: string) {
  return adminFetch<RatePlan[]>(
    `/admin/properties/${propertyId}/rate-plans`,
  );
}

export function createRatePlan(propertyId: string, data: Record<string, unknown>) {
  return adminFetch<RatePlan>(`/admin/properties/${propertyId}/rate-plans`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function upsertRatePrices(propertyId: string, data: Record<string, unknown>) {
  return adminFetch<unknown[]>(
    `/admin/properties/${propertyId}/rate-plans/prices`,
    { method: "POST", body: JSON.stringify(data) },
  );
}

export function searchProperties(params: Record<string, string | number>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  return adminFetch<{ results: SearchResult[]; count: number }>(
    `/search/properties?${query.toString()}`,
  );
}

export function fetchAdminCities() {
  return adminFetch<AdminCity[]>("/admin/cities");
}

export function createAdminCity(data: {
  name: string;
  state?: string;
  country?: string;
}) {
  return adminFetch<AdminCity>("/admin/cities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminCity(
  id: string,
  data: { name?: string; state?: string; country?: string },
) {
  return adminFetch<AdminCity>(`/admin/cities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteAdminCity(id: string) {
  return adminFetch<{ success: boolean }>(`/admin/cities/${id}`, {
    method: "DELETE",
  });
}

export function createAdminArea(cityId: string, name: string) {
  return adminFetch<AdminArea>(`/admin/cities/${cityId}/areas`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function updateAdminArea(id: string, name: string) {
  return adminFetch<AdminArea>(`/admin/areas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export function deleteAdminArea(id: string) {
  return adminFetch<{ success: boolean }>(`/admin/areas/${id}`, {
    method: "DELETE",
  });
}

export function fetchAdminBookings(params?: { page?: number; status?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return adminFetch<{
    results: AdminBooking[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  }>(`/admin/bookings${suffix}`);
}

export function updateAdminBooking(
  id: string,
  data: {
    guestFirstName?: string;
    guestLastName?: string;
    guestPhone?: string;
    guestEmail?: string;
  },
) {
  return adminFetch<AdminBooking>(`/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function acceptAdminBooking(id: string) {
  return adminFetch<AdminBooking>(`/admin/bookings/${id}/accept`, {
    method: "POST",
  });
}

export function cancelAdminBooking(id: string) {
  return adminFetch<AdminBooking>(`/admin/bookings/${id}/cancel`, {
    method: "POST",
  });
}

export function deleteAdminBooking(id: string) {
  return adminFetch<{ success: boolean; deleted: boolean; message?: string }>(
    `/admin/bookings/${id}`,
    { method: "DELETE" },
  );
}
