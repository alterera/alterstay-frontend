"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { setPostLoginRedirect } from "@/lib/booking-url";
import { cn } from "@/lib/utils";

type BookingLoginPromptProps = {
  summaryUrl: string;
  className?: string;
  showBack?: boolean;
};

export function BookingLoginPrompt({
  summaryUrl,
  className,
  showBack = true,
}: BookingLoginPromptProps) {
  const router = useRouter();
  const { openLogin } = useAuth();

  function handleLogin() {
    setPostLoginRedirect(summaryUrl);
    openLogin();
  }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm sm:p-8 lg:min-h-[420px]",
        className,
      )}
    >
      {showBack ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="mb-6 rounded-lg"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
      ) : null}

      <div className="flex min-h-[280px] flex-col justify-center lg:min-h-[320px]">
        <div className="max-w-md border-l-4 border-brand pl-5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Please Log-in to continue
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            We need you to log-in to create a booking
          </p>
        </div>

        <Button
          type="button"
          onClick={handleLogin}
          className="mt-8 h-12 w-full max-w-xs rounded-xl bg-brand text-base font-semibold text-brand-foreground hover:bg-brand/90 sm:w-auto sm:px-10"
        >
          Login / Sign up
        </Button>
      </div>
    </div>
  );
}
