"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

      <div className="mb-8 text-center">

        <h1 className="text-3xl font-bold text-slate-900">
          LOGICARTS
        </h1>

        <p className="mt-2 text-slate-500">
          Operations Portal
        </p>

      </div>

      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            className="w-full rounded-lg border p-3"
            placeholder="admin@logicarts.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border p-3"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          onClick={() => router.push("/portal/dashboard")}
        >
          Sign In
        </Button>

      </div>

    </div>
  );
}
