"use client";

import Link from "next/link";

export default function LoginPage() {

  return (

    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            Logicarts
          </h1>

          <p className="mt-2 text-slate-500">
            Logistics Management System
          </p>

        </div>

        <div className="space-y-5">

          <div>

            <label className="mb-2 block font-medium">
              Username
            </label>

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Enter username"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Password
            </label>

            <input
              type="password"
              className="w-full rounded-lg border p-3"
              placeholder="Enter password"
            />

          </div>

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              Remember Me

            </label>

            <Link
              href="/forgot-password"
              className="text-blue-600"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            className="w-full rounded-lg bg-blue-600 py-3 text-white"
          >
            Login
          </button>

        </div>

      </div>

    </div>

  );

}
