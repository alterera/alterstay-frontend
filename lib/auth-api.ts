import type {
  ApiErrorBody,
  AuthResponse,
  AuthUser,
  RequestOtpResponse,
} from "@/types/auth";
import { authConfig } from "@/config/auth";
import { getAccessToken, getRefreshToken, setTokens } from "@/lib/auth-storage";

/** Refresh if the access token expires within this window. */
const ACCESS_TOKEN_REFRESH_SKEW_MS = 60_000;

/**
 * `NEXT_PUBLIC_API_URL` is inlined into the browser bundle by Next.js and is
 * therefore required for deployed clients. The same-host port fallback keeps
 * local LAN development convenient when no explicit API URL is configured.
 */
function resolveApiBase(): string {
  const envBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  // A deployed frontend must use its explicitly configured backend domain.
  // Vercel domains do not expose the Nest API on port 3001.
  if (envBase) return envBase;

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
    if (!isLocalHost) {
      return `${protocol}//${hostname}:3001`;
    }
  }

  return envBase ?? "http://localhost:3001";
}

/** Prevents concurrent refresh calls from invalidating a rotated refresh token. */
let refreshInFlight: Promise<AuthResponse> | null = null;

function decodeAccessTokenExpiry(accessToken: string): number | null {
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1] ?? "")) as {
      exp?: number;
    };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(
  accessToken: string,
  skewMs = ACCESS_TOKEN_REFRESH_SKEW_MS,
): boolean {
  const expiresAt = decodeAccessTokenExpiry(accessToken);
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - skewMs;
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (body.message) return body.message;
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || "Request failed";
}

async function authFetch(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (init.auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${resolveApiBase()}${path}`, {
    ...init,
    headers,
  });
}

async function apiFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const response = await authFetch(path, init);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<T>;
}

export async function requestOtp(input: {
  phone: string;
  countryCode?: string;
}) {
  return apiFetch<RequestOtpResponse>("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({
      phone: input.phone,
      countryCode: input.countryCode ?? authConfig.countryCode,
    }),
  });
}

export async function verifyOtp(input: {
  phone: string;
  countryCode?: string;
  otp: string;
}) {
  const result = await apiFetch<AuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({
      phone: input.phone,
      countryCode: input.countryCode ?? authConfig.countryCode,
      otp: input.otp,
    }),
  });
  setTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function loginWithPassword(input: {
  phone: string;
  countryCode?: string;
  password: string;
}) {
  const result = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      phone: input.phone,
      countryCode: input.countryCode ?? authConfig.countryCode,
      password: input.password,
    }),
  });
  setTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function refreshSession() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const result = await apiFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    setTokens(result.accessToken, result.refreshToken);
    return result;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

/**
 * Restore a session without rotating refresh tokens unnecessarily.
 * Uses the existing access token when still valid; refreshes only when needed.
 */
export async function restoreSession(): Promise<AuthUser> {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  if (accessToken && !isAccessTokenExpired(accessToken)) {
    try {
      return await fetchCurrentUser();
    } catch {
      // Access token rejected — fall through to refresh once.
    }
  }

  const session = await refreshSession();
  return session.user;
}

export async function logoutSession() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await apiFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  let response = await authFetch("/auth/me", { method: "GET", auth: true });

  if (response.status === 401 && getRefreshToken()) {
    await refreshSession();
    response = await authFetch("/auth/me", { method: "GET", auth: true });
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AuthUser>;
}

export async function updateProfile(
  data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    cityOfResidence: string;
    password: string;
  }>,
): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(data),
  });
}

export { resolveApiBase as getApiBase };
