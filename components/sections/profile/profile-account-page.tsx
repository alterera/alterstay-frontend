"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheckIcon,
  CheckIcon,
  CopyIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { fetchCurrentUser, updateProfile } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

type ProfileNavId = "profile" | "travellers" | "gstin";

const NAV_ITEMS: { id: ProfileNavId; label: string; href?: string }[] = [
  { id: "profile", label: "My Profile" },
  { id: "travellers", label: "Travellers List", href: "#" },
  { id: "gstin", label: "GSTIN", href: "#" },
];

function displayName(user: AuthUser | null) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return name || "Guest";
}

function formatPhone(phone?: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2)}`;
  }
  return phone;
}

function formatMembershipExpiry(value?: string | null) {
  if (!value) return "No expiry";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type ProfileFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  verified?: boolean;
  onSave?: (value: string) => Promise<void>;
  type?: string;
};

function ProfileField({
  label,
  value,
  placeholder,
  verified,
  onSave,
  type = "text",
}: ProfileFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  async function handleSave() {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5">
        {editing ? (
          <Input
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-8 flex-1 border-0 px-0 shadow-none focus-visible:ring-0"
            placeholder={placeholder}
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              value ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {value || placeholder || "—"}
          </span>
        )}
        {verified ? (
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckIcon className="size-3.5" />
          </span>
        ) : onSave ? (
          editing ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={saving}
              onClick={() => void handleSave()}
              className="h-7 px-2 text-xs font-semibold text-brand"
            >
              Save
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-semibold text-sky-600"
            >
              EDIT
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}

export function ProfileAccountPage() {
  const { user: sessionUser, isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(sessionUser);
  const [activeNav, setActiveNav] = useState<ProfileNavId>("profile");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const data = await fetchCurrentUser();
    setProfile(data);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadProfile().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load profile"),
    );
  }, [isAuthenticated, loadProfile]);

  async function saveField(
    patch: Parameters<typeof updateProfile>[0],
  ) {
    setError(null);
    const updated = await updateProfile(patch);
    setProfile(updated);
  }

  async function copyReferralCode() {
    if (!profile?.referralCode) return;
    await navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-[50vh] bg-neutral-100" />;
  }

  const fullName = displayName(profile);

  return (
    <section className="bg-neutral-100 pb-10 pt-0 lg:pt-4">
      <div className="bg-linear-to-r from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] px-4 py-5 text-white sm:px-6">
        <Container className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15">
              <UserRoundIcon className="size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">
                {fullName}
              </h1>
              {profile?.referralCode ? (
                <button
                  type="button"
                  onClick={() => void copyReferralCode()}
                  className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs text-white/90"
                >
                  <span className="truncate">
                    Referral Code : {profile.referralCode}
                  </span>
                  <CopyIcon className="size-3 shrink-0" />
                  {copied ? <span className="text-[10px]">Copied</span> : null}
                </button>
              ) : null}
            </div>
          </div>

          <Link
            href={ROUTES.alterCash}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2e1065]/80 px-3 py-2 text-xs font-medium sm:text-sm"
          >
            <WalletIcon className="size-4 text-amber-300" />
            <span>
              Alter Cash : {(profile?.alterCashBalance ?? 0).toLocaleString("en-IN")}
            </span>
            <span aria-hidden>›</span>
          </Link>
        </Container>
      </div>

      <Container className="mt-4 max-w-6xl">
        {error ? (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <BadgeCheckIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {profile?.membershipTier ?? "Alterstay Member"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expires {formatMembershipExpiry(profile?.membershipExpiresAt)}
                  </p>
                </div>
              </div>
            </div>

            <nav className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              {NAV_ITEMS.map((item) => {
                const active = activeNav === item.id;
                const className = cn(
                  "block w-full border-b px-4 py-3.5 text-left text-sm font-medium last:border-b-0",
                  active
                    ? "bg-brand/5 text-brand"
                    : "text-foreground hover:bg-muted/40",
                );
                if (item.href && item.id !== "profile") {
                  return (
                    <Link key={item.id} href={item.href} className={className}>
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    className={className}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
            {activeNav === "profile" ? (
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">My Profile</h2>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Personal Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileField
                      label="Name"
                      value={fullName === "Guest" ? "" : fullName}
                      placeholder="Add name"
                      onSave={async (value) => {
                        const parts = value.trim().split(/\s+/);
                        const firstName = parts[0] ?? "";
                        const lastName = parts.slice(1).join(" ");
                        await saveField({ firstName, lastName });
                      }}
                    />
                    <ProfileField
                      label="Email"
                      value={profile?.email ?? ""}
                      placeholder="Add email"
                      type="email"
                      onSave={(value) => saveField({ email: value })}
                    />
                    <ProfileField
                      label="Gender"
                      value={profile?.gender ?? ""}
                      placeholder="Pick gender"
                      onSave={(value) => saveField({ gender: value })}
                    />
                    <ProfileField
                      label="Date of Birth"
                      value={profile?.dateOfBirth ?? ""}
                      placeholder="DD/MM/YYYY"
                      type="date"
                      onSave={(value) => saveField({ dateOfBirth: value })}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Login Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileField
                      label="Phone"
                      value={formatPhone(profile?.phone)}
                      verified
                    />
                    <ProfileField
                      label="Password"
                      value={profile?.hasPassword ? "••••••••" : ""}
                      placeholder="Set password"
                      type="password"
                      onSave={(value) => saveField({ password: value })}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Location Information
                  </h3>
                  <ProfileField
                    label="City of Residence"
                    value={profile?.cityOfResidence ?? ""}
                    placeholder="Pick city"
                    onSave={(value) => saveField({ cityOfResidence: value })}
                  />
                </section>
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {activeNav === "travellers"
                  ? "Travellers list is coming soon."
                  : "GSTIN management is coming soon."}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
