import { getApiBase } from "@/lib/auth-api";
import { getAccessToken } from "@/lib/auth-storage";

export type AlterCashTransaction = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  reservationId: string | null;
  createdAt: string;
};

export type AlterCashSummary = {
  balance: number;
  recentTransactions: AlterCashTransaction[];
};

export type AlterCashHistory = {
  items: AlterCashTransaction[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchAlterCashSummary(): Promise<AlterCashSummary> {
  const res = await fetch(`${getApiBase()}/alter-cash/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Could not load coin balance");
  return res.json();
}

export async function fetchAlterCashHistory(
  page = 1,
): Promise<AlterCashHistory> {
  const res = await fetch(
    `${getApiBase()}/alter-cash/history?page=${page}`,
    { headers: authHeaders() },
  );
  if (!res.ok) throw new Error("Could not load coin history");
  return res.json();
}
