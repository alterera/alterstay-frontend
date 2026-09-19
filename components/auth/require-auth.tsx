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
        <div className="bg-brand px-4 py-10 sm:px-6 sm:py-12">
          <Container className="flex items-center gap-5">
            <Skeleton className="size-28 rounded-full bg-white/20 sm:size-32" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 rounded-md bg-white/20" />
              <Skeleton className="h-4 w-32 rounded-md bg-white/20" />
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
