"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

type RequireAuthProps = {
  children: React.ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading, openLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin();
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, openLogin, router]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] bg-background pb-12">
        <div className="bg-brand py-5">
          <Container className="max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-[60px] shrink-0 rounded-full bg-white/20" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36 rounded-md bg-white/20 sm:h-6 sm:w-44" />
                  <Skeleton className="h-3 w-28 rounded-md bg-white/15" />
                </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Skeleton className="h-9 flex-1 rounded-full bg-white/15 sm:w-28" />
                <Skeleton className="h-9 flex-1 rounded-full bg-white/20 sm:w-24" />
              </div>
            </div>
          </Container>
        </div>
        <Container className="mt-8 max-w-6xl space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </Container>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
