"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  WalletCards,
  X,
} from "lucide-react";

type Recharge = {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string | null;
  bankReference: string | null;
  remarks: string | null;
  createdAt: string;
  paidAt: string | null;

  client: {
    id: string;
    code: string;
    companyName: string;
  };

  wallet: {
    balance: number;
  };
};

type RechargeResponse = {
  recharges: Recharge[];
};

type VerifyResponse = {
  success: boolean;
  message: string;

  recharge: {
    id: string;
    amount: number;
    status: string;
    referenceNumber: string | null;
    bankReference: string | null;
    paidAt: string | null;
  };

  wallet: {
    balanceBefore: number;
    balanceAfter: number;
  };

  walletTransactionId: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
}

function statusClass(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-green-50 text-green-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "CANCELLED":
      return "bg-slate-100 text-slate-600";

    case "PROCESSING":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function AdminWalletRechargesPage() {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selected, setSelected] = useState<Recharge | null>(null);
  const [bankReference, setBankReference] = useState("");

  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResponse | null>(null);

  const loadRecharges = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/admin/wallet/recharges", {
        cache: "no-store",
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to load recharge requests.");
      }

      setRecharges(json.recharges || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load recharge requests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecharges();
  }, [loadRecharges]);

  const filteredRecharges = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recharges.filter((recharge) => {
      if (statusFilter !== "ALL" && recharge.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        recharge.referenceNumber,
        recharge.bankReference,
        recharge.client.code,
        recharge.client.companyName,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );
    });
  }, [recharges, search, statusFilter]);

  const pendingCount = recharges.filter(
    (recharge) => recharge.status === "PENDING",
  ).length;

  const successCount = recharges.filter(
    (recharge) => recharge.status === "SUCCESS",
  ).length;

  const pendingAmount = recharges
    .filter((recharge) => recharge.status === "PENDING")
    .reduce((sum, recharge) => sum + recharge.amount, 0);

  function openVerify(recharge: Recharge) {
    setSelected(recharge);
    setBankReference("");
    setVerifyError("");
    setVerifyResult(null);
  }

  function closeVerify() {
    if (verifying) {
      return;
    }

    setSelected(null);
    setBankReference("");
    setVerifyError("");
    setVerifyResult(null);
  }

  async function verifyRecharge() {
    if (!selected) {
      return;
    }

    const reference = bankReference.trim();

    if (!reference) {
      setVerifyError("Enter the bank UTR / transaction reference.");
      return;
    }

    const confirmed = window.confirm(
      `Confirm receipt of ${money(
        selected.amount,
      )} from ${selected.client.companyName}?\n\n` +
        `Recharge: ${selected.referenceNumber || selected.id}\n` +
        `Bank reference: ${reference}\n\n` +
        "This will immediately credit the client's wallet.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setVerifying(true);
      setVerifyError("");
      setVerifyResult(null);

      const response = await fetch(
        `/api/admin/wallet/recharges/${selected.id}/verify`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bankReference: reference,
          }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to verify and credit wallet.");
      }

      setVerifyResult(json);

      await loadRecharges();
    } catch (error) {
      setVerifyError(
        error instanceof Error
          ? error.message
          : "Unable to verify and credit wallet.",
      );
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[#ff7417]">
            Administration
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Wallet Recharges
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review bank transfer requests and credit verified payments to client
            wallets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadRecharges()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Pending Requests</div>

              <div className="mt-2 text-3xl font-bold text-slate-900">
                {pendingCount}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock3 size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Pending Amount</div>

              <div className="mt-2 text-2xl font-bold text-slate-900">
                {money(pendingAmount)}
              </div>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-[#ff7417]">
              <WalletCards size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Successful Recharges</div>

              <div className="mt-2 text-3xl font-bold text-slate-900">
                {successCount}
              </div>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h2 className="font-bold text-slate-900">Recharge Requests</h2>

            <p className="mt-1 text-sm text-slate-500">
              Verify bank receipts before crediting wallets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Client or reference..."
                className="w-64 rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#ff7417]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading recharge requests...
          </div>
        ) : filteredRecharges.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No recharge requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-right">Wallet</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecharges.map((recharge) => (
                  <tr key={recharge.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {new Date(recharge.createdAt).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {recharge.client.companyName}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {recharge.client.code}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="max-w-64 break-all font-medium text-slate-700">
                        {recharge.referenceNumber || "-"}
                      </div>

                      {recharge.bankReference ? (
                        <div className="mt-1 text-xs text-slate-500">
                          UTR: {recharge.bankReference}
                        </div>
                      ) : null}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {recharge.paymentMethod.replaceAll("_", " ")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          recharge.status,
                        )}`}
                      >
                        {recharge.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-slate-900">
                      {money(recharge.amount)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-slate-700">
                      {money(recharge.wallet.balance)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      {recharge.status === "PENDING" &&
                      recharge.paymentMethod === "BANK_TRANSFER" ? (
                        <button
                          type="button"
                          onClick={() => openVerify(recharge)}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          Verify & Credit
                        </button>
                      ) : recharge.status === "SUCCESS" ? (
                        <span className="text-xs font-semibold text-green-600">
                          Credited
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide text-[#ff7417]">
                  Bank Transfer Verification
                </div>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Verify & Credit Wallet
                </h2>
              </div>

              <button
                type="button"
                onClick={closeVerify}
                disabled={verifying}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Client
                  </div>

                  <div className="mt-1 font-bold text-slate-900">
                    {selected.client.companyName}
                  </div>

                  <div className="text-xs text-slate-500">
                    {selected.client.code}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Amount
                  </div>

                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {money(selected.amount)}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Recharge Reference
                  </div>

                  <div className="mt-1 break-all font-semibold text-slate-900">
                    {selected.referenceNumber}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Current Wallet
                  </div>

                  <div className="mt-1 font-bold text-slate-900">
                    {money(selected.wallet.balance)}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    After Credit
                  </div>

                  <div className="mt-1 font-bold text-green-700">
                    {money(selected.wallet.balance + selected.amount)}
                  </div>
                </div>
              </div>

              {!verifyResult ? (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Bank UTR / Transaction Reference
                    </label>

                    <input
                      type="text"
                      value={bankReference}
                      onChange={(event) => setBankReference(event.target.value)}
                      placeholder="Example: UTIBN1234567890"
                      autoFocus
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-[#ff7417]"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Verify this reference against the bank statement before
                      continuing.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Confirming this payment will immediately increase the
                    client's wallet balance by{" "}
                    <strong>{money(selected.amount)}</strong>.
                  </div>

                  {verifyError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {verifyError}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={verifyRecharge}
                    disabled={verifying || !bankReference.trim()}
                    className="w-full rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {verifying
                      ? "Verifying & Crediting..."
                      : `Confirm & Credit ${money(selected.amount)}`}
                  </button>
                </>
              ) : (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={26}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <div className="font-bold text-green-800">
                        Wallet credited successfully
                      </div>

                      <div className="mt-2 text-sm text-green-700">
                        {money(verifyResult.wallet.balanceBefore)} →{" "}
                        <strong>
                          {money(verifyResult.wallet.balanceAfter)}
                        </strong>
                      </div>

                      <div className="mt-2 text-xs text-green-700">
                        UTR: {verifyResult.recharge.bankReference}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeVerify}
                    className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
