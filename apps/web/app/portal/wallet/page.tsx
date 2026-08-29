"use client";

import { useEffect, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  CreditCard,
  Plus,
  RefreshCw,
  WalletCards,
} from "lucide-react";

type WalletTransaction = {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string | null;
  remarks: string | null;
  trackingNumber: string | null;
  createdAt: string;
};

type WalletResponse = {
  client: {
    id: string;
    code: string;
    companyName: string;
    billingType: string;
    status: string;
  };

  wallet: {
    balance: number;
    transactions: WalletTransaction[];
  };
};

type Recharge = {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  referenceNumber: string | null;
  provider: string | null;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  bankReference: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
};

type RechargeResponse = {
  recharges: Recharge[];

  limits: {
    minimum: number;
    maximum: number;
  };
};

type BankInstructions = {
  method: string;
  warning: string;

  bank: {
    isTestConfiguration: boolean;
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    accountType: string;
    supportedMethods: string[];
  };

  instructions: string[];
};

type CreatedRechargeResponse = {
  recharge: Recharge;
  paymentInstructions: BankInstructions;
};

const QUICK_AMOUNTS = [50_000, 1_00_000, 5_00_000, 10_00_000, 20_00_000];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
}

function billingLabel(value: string) {
  switch (value) {
    case "PREPAID_WALLET":
      return "Prepaid Wallet";

    case "CREDIT_ACCOUNT":
      return "Credit Account";

    case "PAY_PER_BOOKING":
      return "Pay Per Booking";

    default:
      return value;
  }
}

function isDebit(type: string) {
  return type === "BOOKING_DEBIT";
}

function rechargeStatusClass(status: string) {
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

export default function WalletPage() {
  const [data, setData] = useState<WalletResponse | null>(null);

  const [rechargeData, setRechargeData] = useState<RechargeResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddMoney, setShowAddMoney] = useState(false);

  const [amount, setAmount] = useState("500");
  const [paymentMethod, setPaymentMethod] = useState<
    "BANK_TRANSFER" | "ONLINE_PAYMENT"
  >("BANK_TRANSFER");

  const [creatingRecharge, setCreatingRecharge] = useState(false);

  const [rechargeError, setRechargeError] = useState("");

  const [createdRecharge, setCreatedRecharge] =
    useState<CreatedRechargeResponse | null>(null);

  async function loadWallet() {
    const response = await fetch("/api/client/wallet", {
      cache: "no-store",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || "Unable to load wallet.");
    }

    setData(json);
  }

  async function loadRecharges() {
    const response = await fetch("/api/client/wallet/recharges", {
      cache: "no-store",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || "Unable to load wallet recharges.");
    }

    setRechargeData(json);
  }

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        await Promise.all([loadWallet(), loadRecharges()]);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load wallet.",
        );
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  /*
   * Keep wallet balance and recharge statuses reasonably fresh.
   *
   * This is especially useful when an Admin verifies a bank
   * transfer while the client already has this page open.
   */
  useEffect(() => {
    const refreshWallet = async () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      try {
        await Promise.all([loadWallet(), loadRecharges()]);
      } catch (error) {
        console.error("Unable to refresh wallet automatically:", error);
      }
    };

    const intervalId = window.setInterval(() => void refreshWallet(), 15_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  async function createRecharge() {
    setRechargeError("");
    setCreatedRecharge(null);

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      setRechargeError("Enter a valid amount.");
      return;
    }

    if (numericAmount < 500 || numericAmount > 20_00_000) {
      setRechargeError("Recharge amount must be between ₹500 and ₹20,00,000.");
      return;
    }

    try {
      setCreatingRecharge(true);

      const response = await fetch("/api/client/wallet/recharges", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: numericAmount,
          paymentMethod,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Unable to create recharge.");
      }

      setCreatedRecharge(json);

      await loadRecharges();
    } catch (error) {
      setRechargeError(
        error instanceof Error ? error.message : "Unable to create recharge.",
      );
    } finally {
      setCreatingRecharge(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Loading wallet...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error || "Unable to load wallet."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[#ff7417]">
            Client Account
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">Wallet</h1>

          <p className="mt-1 text-sm text-slate-500">
            View your prepaid balance, recharges and booking transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddMoney(true);
            setCreatedRecharge(null);
            setRechargeError("");
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ff7417] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Money
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-400">Available Balance</div>

              <div className="mt-2 text-4xl font-bold">
                {money(data.wallet.balance)}
              </div>
            </div>

            <div className="rounded-xl bg-white/10 p-3">
              <WalletCards size={26} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-slate-700 pt-5">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Client ID
              </div>

              <div className="mt-1 font-semibold">{data.client.code}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Company
              </div>

              <div className="mt-1 font-semibold">
                {data.client.companyName}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <CreditCard className="text-[#ff7417]" size={26} />

          <div className="mt-5 text-sm text-slate-500">Billing Model</div>

          <div className="mt-1 text-xl font-bold text-slate-900">
            {billingLabel(data.client.billingType)}
          </div>

          <div className="mt-5 text-sm text-slate-500">Account Status</div>

          <div className="mt-1 inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
            {data.client.status}
          </div>
        </div>
      </div>

      {showAddMoney ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Money</h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a wallet recharge request.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAddMoney(false);
                setCreatedRecharge(null);
                setRechargeError("");
              }}
              className="text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div className="mt-6 max-w-3xl">
            <label className="text-sm font-semibold text-slate-700">
              Recharge Amount
            </label>

            <div className="mt-2 flex items-center rounded-xl border border-slate-300 bg-white px-4">
              <span className="text-lg font-semibold text-slate-500">₹</span>

              <input
                type="number"
                min={500}
                max={20_00_000}
                step={1}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="w-full border-0 bg-transparent px-3 py-4 text-lg font-semibold outline-none"
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Minimum ₹500 · Maximum ₹20,00,000
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <button
                  type="button"
                  key={quickAmount}
                  onClick={() => setAmount(String(quickAmount))}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#ff7417] hover:text-[#ff7417]"
                >
                  {money(quickAmount)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="text-sm font-semibold text-slate-700">
              Payment Method
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-[#ff7417] bg-orange-50/40"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-slate-100 p-2">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <div className="font-bold text-slate-900">
                      Bank Transfer
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      NEFT / RTGS / IMPS
                    </div>

                    <div className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Recommended for business payments
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("ONLINE_PAYMENT")}
                className={`rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "ONLINE_PAYMENT"
                    ? "border-[#ff7417] bg-orange-50/40"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-slate-100 p-2">
                    <CreditCard size={22} />
                  </div>

                  <div>
                    <div className="font-bold text-slate-900">
                      Online Payment
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      UPI / Cards / Net Banking
                    </div>

                    <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Gateway integration pending
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {rechargeError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {rechargeError}
            </div>
          ) : null}

          <div className="mt-6">
            <button
              type="button"
              onClick={createRecharge}
              disabled={creatingRecharge}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingRecharge
                ? "Creating Recharge..."
                : paymentMethod === "BANK_TRANSFER"
                  ? "Generate Bank Transfer Request"
                  : "Continue to Online Payment"}
            </button>
          </div>

          {createdRecharge ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
              <div className="border-b border-amber-200 p-5">
                <div className="text-sm font-bold uppercase tracking-wide text-amber-700">
                  Test Payment Configuration
                </div>

                <div className="mt-1 text-sm text-amber-800">
                  {createdRecharge.paymentInstructions.warning}
                </div>
              </div>

              <div className="grid gap-6 p-5 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recharge Reference
                  </div>

                  <div className="mt-1 break-all text-lg font-bold text-slate-900">
                    {createdRecharge.recharge.referenceNumber}
                  </div>

                  <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Recharge Amount
                  </div>

                  <div className="mt-1 text-xl font-bold text-slate-900">
                    {money(createdRecharge.recharge.amount)}
                  </div>

                  <div className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </div>

                  <div className="mt-1 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                    {createdRecharge.recharge.status}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-5">
                  <div className="font-bold text-slate-900">
                    Dummy Bank Details
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <div className="text-slate-500">Beneficiary</div>

                      <div className="font-semibold">
                        {createdRecharge.paymentInstructions.bank.accountName}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">Bank</div>

                      <div className="font-semibold">
                        {createdRecharge.paymentInstructions.bank.bankName}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">Account Number</div>

                      <div className="font-semibold">
                        {createdRecharge.paymentInstructions.bank.accountNumber}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">IFSC</div>

                      <div className="font-semibold">
                        {createdRecharge.paymentInstructions.bank.ifsc}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">Supported</div>

                      <div className="font-semibold">
                        {createdRecharge.paymentInstructions.bank.supportedMethods.join(
                          " / ",
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-amber-200 p-5 text-sm text-amber-900">
                Wallet balance will not change until payment is verified.
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recharge Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Bank transfer and online recharge requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRecharges()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {!rechargeData || rechargeData.recharges.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No recharge requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rechargeData.recharges.map((recharge) => (
                  <tr key={recharge.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {new Date(recharge.createdAt).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {recharge.referenceNumber || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {recharge.paymentMethod.replaceAll("_", " ")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${rechargeStatusClass(
                          recharge.status,
                        )}`}
                      >
                        {recharge.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900">
                      {money(recharge.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">Wallet Statement</h2>

          <p className="mt-1 text-sm text-slate-500">
            Credits and booking debits for your account.
          </p>
        </div>

        {data.wallet.transactions.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No wallet transactions yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">AWB / Reference</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Balance</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {data.wallet.transactions.map((transaction) => {
                  const debit = isDebit(transaction.type);

                  return (
                    <tr key={transaction.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {new Date(transaction.createdAt).toLocaleString(
                          "en-IN",
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {debit ? (
                            <ArrowUpRight size={17} className="text-red-500" />
                          ) : (
                            <ArrowDownLeft
                              size={17}
                              className="text-green-600"
                            />
                          )}

                          <span className="font-medium text-slate-800">
                            {transaction.type.replaceAll("_", " ")}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {transaction.trackingNumber ??
                          transaction.reference ??
                          "-"}
                      </td>

                      <td
                        className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${
                          debit ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {debit ? "-" : "+"}
                        {money(transaction.amount)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900">
                        {money(transaction.balanceAfter)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
