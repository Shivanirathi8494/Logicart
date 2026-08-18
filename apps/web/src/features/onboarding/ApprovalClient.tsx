"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

export default function ApprovalClient() {
  const params =
    useSearchParams();

  const token =
    params.get("token") || "";

  const [request, setRequest] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!token) {
      setMessage(
        "Approval token is missing."
      );

      setLoading(false);
      return;
    }

    fetch(
      `/api/onboarding/approval?token=${encodeURIComponent(token)}`
    )
      .then((response) =>
        response.json()
      )
      .then((data) => {
        if (data.error) {
          setMessage(
            data.error
          );
        } else {
          setRequest(data);
        }
      })
      .catch(() =>
        setMessage(
          "Unable to load request."
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [token]);

  async function decide(
    decision:
      | "APPROVE"
      | "REJECT"
  ) {
    setWorking(true);

    const reason =
      decision === "REJECT"
        ? window.prompt(
            "Reason for rejection:"
          )
        : null;

    try {
      const response =
        await fetch(
          "/api/onboarding/approval",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                token,
                decision,
                reason,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to process request."
        );
      }

      setMessage(
        data.status ===
          "APPROVED"
          ? "Request approved and account activated."
          : data.status ===
              "REJECTED"
            ? "Request rejected."
            : "Approval recorded. Waiting for the other approval."
      );

      setRequest(
        (current: any) => ({
          ...current,
          status:
            data.status,
          financeStatus:
            data.financeStatus ??
            current?.financeStatus,
          mdStatus:
            data.mdStatus ??
            current?.mdStatus,
        })
      );
    } catch (error: any) {
      setMessage(
        error.message
      );
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        Loading approval request...
      </main>
    );
  }

  if (!request) {
    return (
      <main className="min-h-screen bg-slate-100 p-10 text-red-600">
        {message}
      </main>
    );
  }

  const details =
    request.details || {};

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">
          Logicarts Approval Request
        </h1>

        <p className="mt-2 text-slate-500">
          {request.requestNumber}
          {" · "}
          {request.type}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Company", details.companyName],
            ["GSTIN", details.gstin],
            ["Contact", details.contactPerson],
            ["Email", details.email],
            ["Phone", details.phone],
            ["Origin", details.origin],
            ["Destination", details.destination],
            ["Service", details.serviceType],
            [
              "Expected Billing",
              details.expectedMonthlyBilling,
            ],
            ["Credit Days", details.creditDays],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border bg-slate-50 p-4"
            >
              <div className="text-xs uppercase text-slate-500">
                {label}
              </div>

              <div className="mt-1 font-semibold">
                {value || "-"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border p-4">
          Finance:{" "}
          <b>
            {request.financeStatus}
          </b>
          {" · "}
          MD:{" "}
          <b>
            {request.mdStatus}
          </b>
        </div>

        {message && (
          <div className="mt-6 rounded-lg bg-slate-100 p-4">
            {message}
          </div>
        )}

        {request.status ===
          "PENDING" && (
          <div className="mt-8 flex justify-end gap-3">
            <button
              disabled={working}
              onClick={() =>
                decide("REJECT")
              }
              className="rounded-lg border border-red-300 px-6 py-3 text-red-600"
            >
              Reject
            </button>

            <button
              disabled={working}
              onClick={() =>
                decide("APPROVE")
              }
              className="rounded-lg bg-slate-900 px-6 py-3 text-white"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
