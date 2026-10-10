"use client";

import { useEffect, useRef, useState } from "react";

import {
  authFieldInputClass,
  authFieldPrefixClass,
  authFieldShellClass,
} from "@/components/auth/auth-field-styles";
import { Button } from "@/components/ui/button";
import { CodeSlots, type CodeSlotsStatus } from "@/components/ui/code-slots";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authConfig } from "@/config/auth";
import { cn } from "@/lib/utils";

import { LegalAgreementText } from "./legal-agreement-text";

export type PhoneLoginFormValues = {
  countryCode: string;
  phone: string;
};

type PhoneLoginFormProps = {
  className?: string;
  loading?: boolean;
  error?: string | null;
  onGetOtp?: (values: PhoneLoginFormValues) => void | Promise<void>;
  onVerifyOtp?: (values: PhoneLoginFormValues & { otp: string }) => void | Promise<void>;
  onLoginWithPassword?: (values: PhoneLoginFormValues & { password: string }) => void | Promise<void>;
  onClearError?: () => void;
};

function sanitizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function useAuthCodeSlotMetrics(length: number) {
  const [metrics, setMetrics] = useState({ slotSize: 44, gap: 8, radius: 12 });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const available = w - 80;
      const maxSlot = Math.floor((available - (length - 1) * 6) / length);
      const slotSize = Math.min(46, Math.max(34, maxSlot));
      const gap = slotSize >= 42 ? 8 : 6;
      setMetrics({
        slotSize,
        gap,
        radius: slotSize >= 40 ? 12 : 10,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [length]);

  return metrics;
}

const OTP_ACCENT = "#fafafa";
const OTP_INK = "#ec1846";
const OTP_SLOT = "#27272a";
const OTP_DIGIT = "#18181b";
const OTP_DANGER = "#ec1846";

export function PhoneLoginForm({
  className,
  loading = false,
  error,
  onGetOtp,
  onVerifyOtp,
  onLoginWithPassword,
  onClearError,
}: PhoneLoginFormProps) {
  const [step, setStep] = useState<"phone" | "otp" | "password">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeStatus, setCodeStatus] = useState<CodeSlotsStatus>("idle");
  const verifyLock = useRef(false);
  const slotMetrics = useAuthCodeSlotMetrics(authConfig.otpLength);

  const values: PhoneLoginFormValues = {
    countryCode: authConfig.countryCode,
    phone,
  };

  const isValidPhone = phone.length === 10;
  const isValidOtp = otp.length === authConfig.otpLength;
  const isValidPassword = password.length >= 6;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (error && step === "otp") {
      setCodeStatus("error");
    }
  }, [error, step]);

  function startResendCooldown() {
    setResendCooldown(authConfig.otpResendSeconds);
  }

  async function handleGetOtp() {
    if (!isValidPhone) return;
    await onGetOtp?.(values);
    setStep("otp");
    setOtp("");
    setCodeStatus("idle");
    startResendCooldown();
  }

  async function handleResendOtp() {
    if (!isValidPhone || loading || resendCooldown > 0) return;
    await onGetOtp?.(values);
    setOtp("");
    setCodeStatus("idle");
    onClearError?.();
    startResendCooldown();
  }

  async function handleVerifyOtp(code = otp) {
    if (code.length !== authConfig.otpLength || verifyLock.current) return;
    verifyLock.current = true;
    try {
      await onVerifyOtp?.({ ...values, otp: code });
      setCodeStatus("success");
    } catch {
      setCodeStatus("error");
    } finally {
      verifyLock.current = false;
    }
  }

  async function handlePasswordLogin() {
    if (!isValidPassword) return;
    await onLoginWithPassword?.({ ...values, password });
  }

  function handleOtpChange(code: string) {
    setOtp(code);
    if (codeStatus !== "idle") setCodeStatus("idle");
    onClearError?.();
  }

  const resendWaitLabel = authConfig.otpResendWaitLabel.replace(
    "{seconds}",
    String(resendCooldown),
  );

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex-1 space-y-6">
        <div className="space-y-1.5">
          <h2 className="font-anybody text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {step === "otp"
              ? "Enter OTP"
              : step === "password"
                ? "Login with password"
                : authConfig.welcomeTitle}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {step === "otp"
              ? `We sent a code on WhatsApp to ${authConfig.countryCode} ${phone}`
              : step === "password"
                ? `Enter your password for ${authConfig.countryCode} ${phone}`
                : authConfig.welcomeSubtitle}
          </p>
        </div>

        {error ? (
          <p
            className="rounded-xl border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {step === "phone" ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-phone" className="text-sm font-medium text-foreground">
                  Mobile number
                </Label>
                <div className={authFieldShellClass}>
                  <span className={authFieldPrefixClass}>
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
                    className={authFieldInputClass}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {authConfig.whatsappOtpHint}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                disabled={!isValidPhone || loading}
                onClick={() => void handleGetOtp()}
                className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white shadow-sm transition-transform hover:bg-brand/90 active:scale-[0.99]"
              >
                {loading ? "Sending..." : authConfig.getOtpLabel}
              </Button>
              <button
                type="button"
                disabled={!isValidPhone || loading}
                onClick={() => setStep("password")}
                className="mx-auto mt-2 flex w-fit justify-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                {authConfig.loginWithPasswordLabel}
              </button>
            </div>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                One-time password
              </Label>
              <div className="flex w-full justify-center sm:justify-start">
                <CodeSlots
                  length={authConfig.otpLength}
                  value={otp}
                  status={codeStatus}
                  disabled={loading || codeStatus === "success"}
                  autoFocus
                  onChange={handleOtpChange}
                  onComplete={(code) => void handleVerifyOtp(code)}
                  accentColor={OTP_ACCENT}
                  inkColor={OTP_INK}
                  slotColor={OTP_SLOT}
                  digitColor={OTP_DIGIT}
                  dangerColor={OTP_DANGER}
                  slotSize={slotMetrics.slotSize}
                  gap={slotMetrics.gap}
                  radius={slotMetrics.radius}
                  bounce={0.2}
                  settle={0.3}
                  rise={8}
                  cascade={20}
                  ariaLabel="One-time password"
                  className="max-w-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                disabled={!isValidOtp || loading || codeStatus === "success"}
                onClick={() => void handleVerifyOtp()}
                className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-white shadow-sm transition-transform hover:bg-brand/90 active:scale-[0.99]"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {resendCooldown > 0 ? (
                  resendWaitLabel
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void handleResendOtp()}
                    className="font-medium text-brand underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {authConfig.otpResendLabel}
                  </button>
                )}
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setCodeStatus("idle");
                  setResendCooldown(0);
                  onClearError?.();
                }}
                className="mx-auto flex w-fit justify-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
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
                <Label
                  htmlFor="auth-phone-password"
                  className="text-sm font-medium text-foreground"
                >
                  Mobile number
                </Label>
                <div className={authFieldShellClass}>
                  <span className={authFieldPrefixClass}>
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
                    className={authFieldInputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="auth-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={cn(
                    authFieldShellClass,
                    "h-12 rounded-xl px-3.5 text-base md:text-base",
                  )}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                size="lg"
                disabled={!isValidPhone || !isValidPassword || loading}
                onClick={() => void handlePasswordLogin()}
                className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition-transform hover:bg-brand/90 active:scale-[0.99]"
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
                className="mx-auto flex w-fit justify-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
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
