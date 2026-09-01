"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { WalletCreditCard } from "@/components/ui/credit-card";
import { WalletBalanceCard } from "@/components/wallet/wallet-balance-card";
import { WalletSidebar } from "@/components/wallet/wallet-sidebar";
import { WalletTransactionHistory } from "@/components/wallet/wallet-transaction-history";
import { fetchCurrentUser } from "@/lib/auth-api";
import {
  fetchAlterCashHistory,
  fetchAlterCashSummary,
  type AlterCashTransaction,
} from "@/lib/alter-cash-api";
import type { AuthUser } from "@/types/auth";

function displayHolderName(user: AuthUser | null) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return name || "Alterstay Guest";
}

export function WalletPage() {
  const { isAuthenticated, isLoading: authLoading, openLogin, user } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(user);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<AlterCashTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const [summary, history, currentUser] = await Promise.all([
          fetchAlterCashSummary(),
          fetchAlterCashHistory(1),
          fetchCurrentUser().catch(() => null),
        ]);
        if (!cancelled) {
          setBalance(summary.balance);
          setTransactions(history.items);
          if (currentUser) setProfile(currentUser);
        }
      } catch {
        if (!cancelled) setError("Could not load your wallet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);


  if (authLoading || loading) {
    return (
      <Container className="py-16 text-center text-sm text-muted-foreground">
        Loading wallet…
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-16 text-center">
        <p className="text-muted-foreground">Sign in to view your wallet.</p>
        <Button className="mt-4" onClick={() => openLogin()}>
          Sign in
        </Button>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl py-8 sm:py-10">
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <WalletCreditCard
                holderName={displayHolderName(profile)}
              />
              <WalletBalanceCard balance={balance} />
            </div>

            <WalletTransactionHistory transactions={transactions} />
          </div>

          <WalletSidebar />
        </div>
      )}
    </Container>
  );
}
