"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthProvider, useAuth } from "@/components/auth/auth-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { fetchCurrentUser, restoreSession } from "@/lib/auth-api";
import { clearTokens, getRefreshToken } from "@/lib/auth-storage";

function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [ready, setReady] = useState(false);
  const [adminName, setAdminName] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!getRefreshToken()) {
        router.replace(ROUTES.auth.admin);
        return;
      }

      try {
        await restoreSession();
        const user = await fetchCurrentUser();
        if (!user.roles?.includes("SUPER_ADMIN")) {
          clearTokens();
          router.replace(ROUTES.auth.admin);
          return;
        }
        if (!cancelled) {
          setAdminName(
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.phone,
          );
          setReady(true);
        }
      } catch {
        clearTokens();
        router.replace(ROUTES.auth.admin);
      }
    }

    void verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-3 p-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <AdminShell
      adminName={adminName}
      onLogout={async () => {
        await logout();
        router.replace(ROUTES.auth.admin);
      }}
    >
      {children}
    </AdminShell>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGate>{children}</AdminGate>
    </AuthProvider>
  );
}
