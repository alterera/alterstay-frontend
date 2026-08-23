"use client";

import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/common/logo";
import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

import { PhoneLoginForm, type PhoneLoginFormValues } from "./phone-login-form";

type MobileLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileLoginDialog({
  open,
  onOpenChange,
}: MobileLoginDialogProps) {
  const { requestPhoneOtp, verifyPhoneOtp, loginPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetOtp(values: PhoneLoginFormValues) {
    setLoading(true);
    setError(null);
    try {
      await requestPhoneOtp(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(
    values: PhoneLoginFormValues & { otp: string },
  ) {
    setLoading(true);
    setError(null);
    try {
      await verifyPhoneOtp(values);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordLogin(
    values: PhoneLoginFormValues & { password: string },
  ) {
    setLoading(true);
    setError(null);
    try {
      await loginPassword(values);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "inset-0 top-0 left-0 flex h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 ring-0",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{authConfig.welcomeTitle}</DialogTitle>
          <DialogDescription>{authConfig.welcomeSubtitle}</DialogDescription>
        </DialogHeader>

        <div className="flex h-[20%] min-h-28 items-center justify-center bg-brand px-6">
          <Logo size="lg" />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto bg-background px-5 py-6 sm:px-8">
          <PhoneLoginForm
            loading={loading}
            error={error}
            onGetOtp={handleGetOtp}
            onVerifyOtp={handleVerifyOtp}
            onLoginWithPassword={handlePasswordLogin}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
