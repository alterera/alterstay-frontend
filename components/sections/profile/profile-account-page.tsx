"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { ProfileEditShell } from "@/components/sections/profile/profile-edit-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchCurrentUser, updateProfile } from "@/lib/auth-api";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

const GENDER_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
] as const;

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
      <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2.5">
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

function GenderField({
  value,
  onSave,
}: {
  value: string;
  onSave: (value: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  async function handleChange(next: string) {
    setDraft(next);
    setSaving(true);
    try {
      await onSave(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="profile-gender" className="text-xs text-muted-foreground">
        Gender
      </Label>
      <div className="rounded-md border bg-white px-3 py-2">
        <select
          id="profile-gender"
          value={draft}
          disabled={saving}
          onChange={(event) => void handleChange(event.target.value)}
          className="h-8 w-full bg-transparent text-sm outline-none"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value || "none"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ProfileAccountPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const data = await fetchCurrentUser();
    setProfile(data);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void loadProfile().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load profile"),
    );
  }, [isAuthenticated, loadProfile]);

  async function saveField(patch: Parameters<typeof updateProfile>[0]) {
    setError(null);
    const updated = await updateProfile(patch);
    setProfile(updated);
  }

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  const fullName = displayName(profile);

  return (
    <ProfileEditShell activeNav="profile">
      <div className="space-y-8">
        <h2 className="text-xl font-semibold">My Profile</h2>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

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
            <GenderField
              value={profile?.gender ?? ""}
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
    </ProfileEditShell>
  );
}
