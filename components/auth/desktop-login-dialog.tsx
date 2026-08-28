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
import { authConfig } from "@/config/auth";

import { LoginImagePanel } from "./login-image-panel";
import { PhoneLoginForm, type PhoneLoginFormValues } from "./phone-login-form";

type DesktopLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DesktopLoginDialog({
  open,
  onOpenChange,
}: DesktopLoginDialogProps) {
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
        className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-3xl lg:max-w-5xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{authConfig.welcomeTitle}</DialogTitle>
          <DialogDescription>{authConfig.welcomeSubtitle}</DialogDescription>
        </DialogHeader>

        <div className="grid min-h-[500px] md:grid-cols-[1.15fr_0.85fr]">
          <LoginImagePanel />
          <div className="flex flex-col justify-center bg-background p-6 sm:p-8">
            <PhoneLoginForm
              loading={loading}
              error={error}
              onGetOtp={handleGetOtp}
              onVerifyOtp={handleVerifyOtp}
              onLoginWithPassword={handlePasswordLogin}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
