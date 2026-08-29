"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type ProfileData = {
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string | null;
    phone: string | null;
  };

  client: {
    id: string;
    code: string;
    companyName: string;
    contactPerson: string | null;
    email: string | null;
    phone: string | null;
    gstNumber: string | null;
    billingType: string;
    status: string;
  };
};

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="min-h-[48px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
        {value || "—"}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/client/profile", {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load profile.");
        }

        setProfile(data);
      } catch (error: any) {
        if (error?.name === "AbortError") {
          return;
        }

        setLoadError(error?.message || "Unable to load profile.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      controller.abort();
    };
  }, []);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password.",
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch("/api/client/profile", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess("Password changed successfully.");
    } catch (error: any) {
      setPasswordError(error?.message || "Unable to change password.");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

        <p className="mt-2 text-slate-500">
          View your account information and manage your password.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {loadError}
        </div>
      ) : profile ? (
        <>
          <section className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your account and company information is managed by Logicarts.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <ReadOnlyField label="Client ID" value={profile.client.code} />

              <ReadOnlyField
                label="Company Name"
                value={profile.client.companyName}
              />

              <ReadOnlyField label="Full Name" value={profile.user.fullName} />

              <ReadOnlyField label="Username" value={profile.user.username} />

              <ReadOnlyField label="Email" value={profile.user.email} />

              <ReadOnlyField label="Mobile" value={profile.user.phone} />

              <ReadOnlyField
                label="GST Number"
                value={profile.client.gstNumber}
              />

              <ReadOnlyField
                label="Billing Type"
                value={profile.client.billingType
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (character) => character.toUpperCase())}
              />
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter your current password before choosing a new password.
              </p>
            </div>

            <form onSubmit={changePassword} className="max-w-xl space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Password
                </label>

                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  required
                  minLength={8}
                />

                <p className="mt-1 text-xs text-slate-500">
                  Minimum 8 characters.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                  required
                  minLength={8}
                />
              </div>

              {passwordError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {passwordError}
                </div>
              ) : null}

              {passwordSuccess ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {passwordSuccess}
                </div>
              ) : null}

              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </section>
        </>
      ) : null}
    </div>
  );
}
