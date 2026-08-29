"use client";

import Link from "next/link";

import { FormEvent, useState } from "react";

const TYPES = ["CLIENT", "AGENT", "CUSTOMER", "EMPLOYEE"] as const;

type Type = (typeof TYPES)[number];

const initial = {
  companyName: "",
  code: "",
  gstin: "",
  pan: "",
  contactPerson: "",
  designation: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",

  origin: "",
  airport: "",
  destination: "",
  tripType: "",
  shipmentFrequency: "",
  expectedStartDate: "",
  serviceType: "",
  valueAddedServices: "",

  commodity: "",
  contentsType: "",
  packageCount: "",
  dimensions: "",
  averageWeight: "",
  totalWeight: "",
  monthlyVolume: "",
  annualVolume: "",

  currentIncumbent: "",
  currentRate: "",
  transitTime: "",
  painPoints: "",
  expectedMonthlyBilling: "",
  creditDays: "",
  billingCycle: "",

  // Client commercial setup
  billingType: "PREPAID_WALLET",
  rateEffectiveFrom: "",
  rateEffectiveUntil: "",

  rateOrigin: "",
  rateDestination: "",
  rateServiceType: "",

  minimumFreight: "0",
  awbCharge: "0",
  handlingCharge: "0",
  pickupCharge: "0",
  deliveryCharge: "0",
  fuelSurchargePct: "0",
  gstPct: "18",

  openingBalance: "0",
  paymentMode: "",
  paymentReference: "",
  paymentDate: "",

  agentType: "LOGISTICS_COMPANY",

  name: "",
  username: "",
  employeeCode: "",
};

export default function OnboardingPage() {
  const [type, setType] = useState<Type>("CLIENT");

  const [form, setForm] = useState<any>({
    ...initial,
  });

  const [message, setMessage] = useState("");

  const [createdClient, setCreatedClient] = useState<{
    clientCode: string;
    username: string;
    temporaryPassword: string;
  } | null>(null);

  const emptyRateRoute = () => ({
    origin: "",
    destination: "",
    serviceType: "",
    minimumFreight: "0",
    awbCharge: "0",
    handlingCharge: "0",
    pickupCharge: "0",
    deliveryCharge: "0",
    fuelSurchargePct: "0",
    gstPct: "18",
    slabs: [
      {
        minWeight: "0",
        maxWeight: "",
        ratePerKg: "",
      },
    ],
  });

  const [rateRoutes, setRateRoutes] = useState<any[]>([emptyRateRoute()]);

  const [saving, setSaving] = useState(false);

  function set(field: string, value: string) {
    setForm((current: any) => ({
      ...current,
      [field]: value,
    }));
  }

  function switchType(next: Type) {
    setType(next);
    setForm({ ...initial });
    setRateRoutes([emptyRateRoute()]);
    setMessage("");
    setCreatedClient(null);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setCreatedClient(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          type,
          details:
            type === "CLIENT"
              ? {
                  ...form,
                  rateRoutes,
                }
              : form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save.");
      }

      if (type === "CLIENT") {
        setMessage("Client created successfully.");

        setCreatedClient({
          clientCode: String(data.clientCode || ""),
          username: String(data.username || ""),
          temporaryPassword: String(data.temporaryPassword || ""),
        });
      } else if (type === "AGENT") {
        setMessage(`AGENT request ${data.requestNumber} created successfully.`);
      } else if (type === "EMPLOYEE") {
        setMessage(
          `Employee created. Username: ${data.username} | Temporary Password: ${data.temporaryPassword}`,
        );
      } else {
        setMessage("Customer created successfully.");
      }

      setForm({
        ...initial,
      });

      setRateRoutes([emptyRateRoute()]);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  const enquiry = type === "CLIENT" || type === "AGENT";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Onboarding & Access</h1>

          <p className="mt-2 text-slate-500">
            Admin-controlled Client, Agent, Customer and Employee creation.
          </p>
        </div>

        <Link
          href="/portal/masters/onboarding/status"
          className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          View Requests
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm">
        {TYPES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => switchType(item)}
            className={`rounded-lg px-5 py-3 text-sm font-semibold ${
              type === item
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow-sm">
        {type === "EMPLOYEE" ? (
          <Section title="Employee Details">
            <Field
              label="Name"
              value={form.name}
              required
              onChange={(v) => set("name", v)}
            />

            <Field
              label="Username"
              value={form.username}
              onChange={(v) => set("username", v)}
            />

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
            />

            <Field
              label="Phone Number"
              value={form.phone}
              onChange={(v) => set("phone", v)}
            />

            <Field
              label="City"
              value={form.city}
              onChange={(v) => set("city", v)}
            />

            <Field
              label="Airport of Operation"
              value={form.airport}
              onChange={(v) => set("airport", v)}
            />

            <Field
              label="Destination"
              value={form.destination}
              onChange={(v) => set("destination", v)}
            />
          </Section>
        ) : (
          <>
            <Section title="Customer Details">
              <Field
                label="Company Name"
                value={form.companyName}
                required
                onChange={(v) => set("companyName", v)}
              />

              <Field
                label="GSTIN"
                value={form.gstin}
                onChange={(v) => set("gstin", v)}
              />

              <Field
                label="PAN"
                value={form.pan}
                onChange={(v) => set("pan", v)}
              />

              <Field
                label="Contact Person"
                value={form.contactPerson}
                onChange={(v) => set("contactPerson", v)}
              />

              <Field
                label="Designation"
                value={form.designation}
                onChange={(v) => set("designation", v)}
              />

              <Field
                label="Mobile Number"
                value={form.phone}
                onChange={(v) => set("phone", v)}
              />

              <Field
                label="Email Address"
                type="email"
                value={form.email}
                required={enquiry}
                onChange={(v) => set("email", v)}
              />

              <Field
                label="Office Address"
                value={form.address}
                onChange={(v) => set("address", v)}
              />

              <Field
                label="City"
                value={form.city}
                onChange={(v) => set("city", v)}
              />

              <Field
                label="State"
                value={form.state}
                onChange={(v) => set("state", v)}
              />
            </Section>

            {enquiry && (
              <>
                {type === "CLIENT" && (
                  <>
                    <Section title="Client Commercial Setup">
                      <Select
                        label="Billing Model"
                        value={form.billingType}
                        options={[
                          ["PREPAID_WALLET", "Prepaid Wallet"],
                          ["CREDIT_ACCOUNT", "Credit Account"],
                          ["PAY_PER_BOOKING", "Pay Per Booking"],
                        ]}
                        onChange={(v) => set("billingType", v)}
                      />

                      <Field
                        label="Rate Effective From"
                        type="date"
                        value={form.rateEffectiveFrom}
                        required
                        onChange={(v) => set("rateEffectiveFrom", v)}
                      />

                      <Field
                        label="Rate Effective Until"
                        type="date"
                        value={form.rateEffectiveUntil}
                        onChange={(v) => set("rateEffectiveUntil", v)}
                      />
                    </Section>

                    <div className="mt-8 space-y-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Client Rate Card
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Configure multiple origin and destination routes.
                            Every route has its own weight slabs and charges.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setRateRoutes((current) => [
                              ...current,
                              emptyRateRoute(),
                            ])
                          }
                          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          + Add Route
                        </button>
                      </div>

                      <div className="space-y-6">
                        {rateRoutes.map((route, routeIndex) => (
                          <div
                            key={routeIndex}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                          >
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-slate-900">
                                  Route #{routeIndex + 1}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                  Independent contracted pricing for this route.
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={rateRoutes.length === 1}
                                onClick={() =>
                                  setRateRoutes((current) =>
                                    current.filter(
                                      (_, index) => index !== routeIndex,
                                    ),
                                  )
                                }
                                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Remove Route
                              </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <Field
                                label="Rate Origin"
                                value={route.origin}
                                placeholder="e.g. BLR"
                                required
                                onChange={(value) =>
                                  setRateRoutes((current) =>
                                    current.map((item, index) =>
                                      index === routeIndex
                                        ? {
                                            ...item,
                                            origin: value.toUpperCase(),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />

                              <Field
                                label="Rate Destination"
                                value={route.destination}
                                placeholder="e.g. DEL"
                                required
                                onChange={(value) =>
                                  setRateRoutes((current) =>
                                    current.map((item, index) =>
                                      index === routeIndex
                                        ? {
                                            ...item,
                                            destination: value.toUpperCase(),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />

                              <Select
                                label="Rate Service Type"
                                value={route.serviceType}
                                options={[
                                  ["Airport to Airport", "Airport to Airport"],
                                  [
                                    "Airport to Warehouse",
                                    "Airport to Warehouse",
                                  ],
                                  [
                                    "Warehouse to Airport",
                                    "Warehouse to Airport",
                                  ],
                                  [
                                    "Warehouse to Warehouse",
                                    "Warehouse to Warehouse",
                                  ],
                                  ["Door to Door", "Door to Door"],
                                ]}
                                onChange={(value) =>
                                  setRateRoutes((current) =>
                                    current.map((item, index) =>
                                      index === routeIndex
                                        ? {
                                            ...item,
                                            serviceType: value,
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-5">
                              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <div className="text-sm font-bold text-slate-800">
                                    Weight Slabs
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    Rate is applied using chargeable weight.
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setRateRoutes((current) =>
                                      current.map((item, index) =>
                                        index === routeIndex
                                          ? {
                                              ...item,
                                              slabs: [
                                                ...item.slabs,
                                                {
                                                  minWeight: "",
                                                  maxWeight: "",
                                                  ratePerKg: "",
                                                },
                                              ],
                                            }
                                          : item,
                                      ),
                                    )
                                  }
                                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                  + Add Weight Slab
                                </button>
                              </div>

                              <div className="space-y-3">
                                {route.slabs.map(
                                  (slab: any, slabIndex: number) => (
                                    <div
                                      key={slabIndex}
                                      className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
                                    >
                                      <label>
                                        <span className="mb-2 block text-xs font-semibold text-slate-600">
                                          From Kg
                                        </span>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          required
                                          value={slab.minWeight}
                                          onChange={(event) =>
                                            setRateRoutes((current) =>
                                              current.map((item, index) =>
                                                index === routeIndex
                                                  ? {
                                                      ...item,
                                                      slabs: item.slabs.map(
                                                        (
                                                          existing: any,
                                                          index2: number,
                                                        ) =>
                                                          index2 === slabIndex
                                                            ? {
                                                                ...existing,
                                                                minWeight:
                                                                  event.target
                                                                    .value,
                                                              }
                                                            : existing,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-500"
                                        />
                                      </label>

                                      <label>
                                        <span className="mb-2 block text-xs font-semibold text-slate-600">
                                          To Kg
                                        </span>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={slab.maxWeight}
                                          placeholder="No upper limit"
                                          onChange={(event) =>
                                            setRateRoutes((current) =>
                                              current.map((item, index) =>
                                                index === routeIndex
                                                  ? {
                                                      ...item,
                                                      slabs: item.slabs.map(
                                                        (
                                                          existing: any,
                                                          index2: number,
                                                        ) =>
                                                          index2 === slabIndex
                                                            ? {
                                                                ...existing,
                                                                maxWeight:
                                                                  event.target
                                                                    .value,
                                                              }
                                                            : existing,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-500"
                                        />
                                      </label>

                                      <label>
                                        <span className="mb-2 block text-xs font-semibold text-slate-600">
                                          Rate ₹ / Kg
                                        </span>
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          required
                                          value={slab.ratePerKg}
                                          onChange={(event) =>
                                            setRateRoutes((current) =>
                                              current.map((item, index) =>
                                                index === routeIndex
                                                  ? {
                                                      ...item,
                                                      slabs: item.slabs.map(
                                                        (
                                                          existing: any,
                                                          index2: number,
                                                        ) =>
                                                          index2 === slabIndex
                                                            ? {
                                                                ...existing,
                                                                ratePerKg:
                                                                  event.target
                                                                    .value,
                                                              }
                                                            : existing,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-500"
                                        />
                                      </label>

                                      <div className="flex items-end">
                                        <button
                                          type="button"
                                          disabled={route.slabs.length === 1}
                                          onClick={() =>
                                            setRateRoutes((current) =>
                                              current.map((item, index) =>
                                                index === routeIndex
                                                  ? {
                                                      ...item,
                                                      slabs: item.slabs.filter(
                                                        (
                                                          _: any,
                                                          index2: number,
                                                        ) =>
                                                          index2 !== slabIndex,
                                                      ),
                                                    }
                                                  : item,
                                              ),
                                            )
                                          }
                                          className="rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-5">
                              <div className="mb-4 text-sm font-bold text-slate-800">
                                Additional Charges
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                {[
                                  ["minimumFreight", "Minimum Freight (₹)"],
                                  ["awbCharge", "AWB / Docket Charge (₹)"],
                                  ["handlingCharge", "Handling Charge (₹)"],
                                  ["pickupCharge", "Pickup Charge (₹)"],
                                  ["deliveryCharge", "Delivery Charge (₹)"],
                                  ["fuelSurchargePct", "Fuel Surcharge (%)"],
                                  ["gstPct", "GST (%)"],
                                ].map(([field, label]) => (
                                  <Field
                                    key={field}
                                    label={label}
                                    type="number"
                                    value={route[field]}
                                    onChange={(value) =>
                                      setRateRoutes((current) =>
                                        current.map((item, index) =>
                                          index === routeIndex
                                            ? {
                                                ...item,
                                                [field]: value,
                                              }
                                            : item,
                                        ),
                                      )
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {form.billingType === "PREPAID_WALLET" && (
                      <Section title="Prepaid Wallet Setup">
                        <Field
                          label="Opening Balance (₹)"
                          type="number"
                          value={form.openingBalance}
                          onChange={(v) => set("openingBalance", v)}
                        />

                        <Select
                          label="Payment Mode"
                          value={form.paymentMode}
                          options={[
                            ["BANK_TRANSFER", "Bank Transfer"],
                            ["UPI", "UPI"],
                            ["CHEQUE", "Cheque"],
                            ["CASH", "Cash"],
                            ["OTHER", "Other"],
                          ]}
                          onChange={(v) => set("paymentMode", v)}
                        />

                        <Field
                          label="Payment Reference / UTR"
                          value={form.paymentReference}
                          placeholder="UTR / transaction reference"
                          onChange={(v) => set("paymentReference", v)}
                        />

                        <Field
                          label="Payment Date"
                          type="date"
                          value={form.paymentDate}
                          onChange={(v) => set("paymentDate", v)}
                        />

                        <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                          The opening balance will be credited to the client
                          wallet only after the CLIENT request receives final
                          approval.
                        </div>
                      </Section>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {message && (
          <div className="mt-6 rounded-lg bg-slate-100 p-4">{message}</div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-7 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : `Create ${type}`}
          </button>
        </div>
        {createdClient && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="text-lg font-bold text-emerald-900">
              Client created successfully
            </div>

            <p className="mt-1 text-sm text-emerald-800">
              Save these login credentials now. The temporary password cannot be
              retrieved later.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Client ID
                </div>

                <div className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                  {createdClient.clientCode || "—"}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Username
                </div>

                <div className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                  {createdClient.username}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(createdClient.username)
                  }
                  className="mt-3 text-xs font-semibold text-slate-600 underline"
                >
                  Copy Username
                </button>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Temporary Password
                </div>

                <div className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                  {createdClient.temporaryPassword}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      createdClient.temporaryPassword,
                    )
                  }
                  className="mt-3 text-xs font-semibold text-slate-600 underline"
                >
                  Copy Password
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-white/80 px-4 py-3 text-xs text-slate-600">
              For security, only the password hash is stored after creation. Ask
              the client to change the temporary password after signing in.
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 border-b pb-3 text-lg font-semibold">{title}</h2>

      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && " *"}
      </span>

      <input
        required={required}
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-3"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-3"
      >
        <option value="">Select</option>

        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <textarea
        rows={4}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-3"
      />
    </label>
  );
}
