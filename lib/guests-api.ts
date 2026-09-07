import { getAccessToken, getRefreshToken } from "@/lib/auth-storage";
import { getApiBase, refreshSession } from "@/lib/auth-api";

export type SavedGuest = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

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

async function guestsFetch<T>(
  path: string,
  init: RequestInit = {},
  allowRefresh = true,
): Promise<T> {
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
      throw new Error(await parseError(response));
    }
    return guestsFetch(path, init, false);
  }

  if (!response.ok) throw new Error(await parseError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function fetchSavedGuests() {
  return guestsFetch<SavedGuest[]>("/guests");
}

export function createSavedGuest(data: {
  name: string;
  phone: string;
  email?: string;
}) {
  return guestsFetch<SavedGuest>("/guests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSavedGuest(
  id: string,
  data: { name?: string; phone?: string; email?: string | null },
) {
  return guestsFetch<SavedGuest>(`/guests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteSavedGuest(id: string) {
  return guestsFetch<{ success: boolean }>(`/guests/${id}`, {
    method: "DELETE",
  });
}
