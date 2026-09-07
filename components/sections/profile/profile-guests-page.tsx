"use client";

import { useEffect, useState } from "react";
import { Loader2Icon, PlusIcon, Trash2Icon, UserRoundIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { ProfileEditShell } from "@/components/sections/profile/profile-edit-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSavedGuest,
  deleteSavedGuest,
  fetchSavedGuests,
  type SavedGuest,
} from "@/lib/guests-api";
import { formatDisplayPhone, normalizeBookingPhone } from "@/lib/format";

export function ProfileGuestsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [guests, setGuests] = useState<SavedGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    setLoading(true);
    fetchSavedGuests()
      .then((items) => {
        if (!cancelled) setGuests(items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load guests");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      const created = await createSavedGuest({
        name: form.name.trim(),
        phone: normalizeBookingPhone(form.phone),
        email: form.email.trim() || undefined,
      });
      setGuests((current) => [created, ...current]);
      setForm({ name: "", phone: "", email: "" });
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save guest");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      await deleteSavedGuest(id);
      setGuests((current) => current.filter((guest) => guest.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete guest");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  return (
    <ProfileEditShell activeNav="guests">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Guest Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Save travellers for faster checkout
            </p>
          </div>
          <Button
            type="button"
            className="rounded-full"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="size-4" />
            Add guest
          </Button>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : guests.length === 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-12 text-center">
            <UserRoundIcon className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No saved guests yet. Add one to reuse at booking.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {guests.map((guest) => (
              <li
                key={guest.id}
                className="flex items-start justify-between gap-3 rounded-xl border bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{guest.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatDisplayPhone(guest.phone)}
                    {guest.email ? ` · ${guest.email}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={deletingId === guest.id}
                  onClick={() => void handleDelete(guest.id)}
                  aria-label={`Delete ${guest.name}`}
                >
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold">Add new guest</h3>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="guest-name">Name</Label>
                <Input
                  id="guest-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guest-phone">Phone</Label>
                <Input
                  id="guest-phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="10-digit mobile"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guest-email">Email (optional)</Label>
                <Input
                  id="guest-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={
                  saving || form.name.trim().length < 2 || form.phone.trim().length < 8
                }
                onClick={() => void handleCreate()}
              >
                {saving ? "Saving…" : "Save guest"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ProfileEditShell>
  );
}
