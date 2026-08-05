"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import PageContainer from "@/components/page/PageContainer";
import PageHero from "@/components/page/PageHero";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        password,
      }),

    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {

      setError(data.error);

      return;

    }

    router.push("/portal/dashboard");

  }

  return (
    <>
      <PageHero
        title="Logicarts Login"
        subtitle="Sign in to access the Logistics Management System."
      />

      <PageContainer>

        <form
          onSubmit={login}
          className="mx-auto max-w-md rounded-xl border bg-white p-8 shadow"
        >

          <div className="space-y-5">

            <div>

              <label className="mb-2 block">
                Username
              </label>

              <input
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                className="w-full rounded-lg border p-3"
              />

            </div>

            <div>

              <label className="mb-2 block">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full rounded-lg border p-3"
              />

            </div>

            {error && (

              <div className="rounded bg-red-100 p-3 text-red-700">

                {error}

              </div>

            )}

            <div className="flex justify-between">

              <Link
                href="/forgot-password"
                className="text-blue-600"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 text-white"
            >

              {loading ? "Signing In..." : "Sign In"}

            </button>

          </div>

        </form>

      </PageContainer>

    </>
  );

}
