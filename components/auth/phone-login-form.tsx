"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

import { LegalAgreementText } from "./legal-agreement-text";

export type PhoneLoginFormValues = {
  countryCode: string;
  phone: string;
  sendWhatsappOtp: boolean;
};

type PhoneLoginFormProps = {
  className?: string;
  loading?: boolean;
  error?: string | null;
  onGetOtp?: (values: PhoneLoginFormValues) => void | Promise<void>;
  onVerifyOtp?: (values: PhoneLoginFormValues & { otp: string }) => void | Promise<void>;
  onLoginWithPassword?: (values: PhoneLoginFormValues & { password: string }) => void | Promise<void>;
};

function sanitizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function PhoneLoginForm({
  className,
  loading = false,
  error,
  onGetOtp,
  onVerifyOtp,
  onLoginWithPassword,
}: PhoneLoginFormProps) {
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [sendWhatsappOtp, setSendWhatsappOtp] = useState(true);

  const values: PhoneLoginFormValues = {
    countryCode: authConfig.countryCode,
    phone,
    sendWhatsappOtp,
  };

  const isValidPhone = phone.length === 10;
  const isValidOtp = otp.length >= 4;
  const isValidPassword = password.length >= 6;

  async function handleGetOtp() {
    if (!isValidPhone) return;
    await onGetOtp?.(values);
    setStep("otp");
  }

  async function handleVerifyOtp() {
    if (!isValidOtp) return;
    await onVerifyOtp?.({ ...values, otp });
  }

  async function handlePasswordLogin() {
    if (!isValidPassword) return;
    await onLoginWithPassword?.({ ...values, password });
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex-1 space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {step === "otp"
              ? "Enter OTP"
              : step === "password"
                ? "Login with password"
                : authConfig.welcomeTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {step === "otp"
              ? `We sent a code to ${authConfig.countryCode} ${phone}`
              : step === "password"
                ? `Enter your password for ${authConfig.countryCode} ${phone}`
                : authConfig.welcomeSubtitle}
          </p>
        </div>

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {step === "phone" ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-phone" className="text-sm text-foreground">
                  Mobile number
                </Label>
                <div className="flex overflow-hidden rounded-xl border border-input bg-background focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50">
                  <span className="flex items-center border-r border-input bg-muted/40 px-3 text-sm font-medium text-foreground">
                    {authConfig.countryCode}
                  </span>
                  <Input
                    id="auth-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={authConfig.phonePlaceholder}
                    value={phone}
                    onChange={(event) =>
                      setPhone(sanitizePhone(event.target.value))
                    }
                    className="h-11 flex-1 border-0 rounded-none text-base shadow-none focus-visible:ring-0 md:text-base"
                  />
                </div>
              </div>

              <Label
                htmlFor="auth-whatsapp-otp"
                className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-foreground"
              >
                <Checkbox
                  id="auth-whatsapp-otp"
                  checked={sendWhatsappOtp}
                  onCheckedChange={(checked) =>
                    setSendWhatsappOtp(checked === true)
                  }
                  className="rounded-sm"
                />
                {authConfig.whatsappOtpLabel}
              </Label>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                disabled={!isValidPhone || loading}
                onClick={() => void handleGetOtp()}
                className="h-11 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
              >
                {loading ? "Sending..." : authConfig.getOtpLabel}
              </Button>
              <button
                type="button"
                disabled={!isValidPhone || loading}
                onClick={() => setStep("password")}
                className="mx-auto mt-5 flex w-fit justify-center text-sm font-medium underline"
              >
                {authConfig.loginWithPasswordLabel}
              </button>
            </div>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="auth-otp" className="text-sm text-foreground">
                One-time password
              </Label>
              <Input
                id="auth-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter OTP"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 8))
                }
                className="h-11 rounded-xl text-base tracking-widest"
              />
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                disabled={!isValidOtp || loading}
                onClick={() => void handleVerifyOtp()}
                className="h-11 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
                className="mx-auto flex w-fit justify-center text-sm font-medium underline"
              >
                Change number
              </button>
            </div>
          </>
        ) : null}

        {step === "password" ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-phone-password" className="text-sm text-foreground">
                  Mobile number
                </Label>
                <div className="flex overflow-hidden rounded-xl border border-input bg-background">
                  <span className="flex items-center border-r border-input bg-muted/40 px-3 text-sm font-medium text-foreground">
                    {authConfig.countryCode}
                  </span>
                  <Input
                    id="auth-phone-password"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(event) =>
                      setPhone(sanitizePhone(event.target.value))
                    }
                    className="h-11 flex-1 border-0 rounded-none text-base shadow-none focus-visible:ring-0 md:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-password" className="text-sm text-foreground">
                  Password
                </Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 rounded-xl text-base"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                disabled={!isValidPhone || !isValidPassword || loading}
                onClick={() => void handlePasswordLogin()}
                className="h-11 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep("phone");
                  setPassword("");
                }}
                className="mx-auto flex w-fit justify-center text-sm font-medium underline"
              >
                Use OTP instead
              </button>
            </div>
          </>
        ) : null}
      </div>

      <LegalAgreementText className="mt-8" />
    </div>
  );
}
