"use client";

import Link from "next/link";

import {
  FormEvent,
  useState,
} from "react";

const TYPES = [
  "CLIENT",
  "AGENT",
  "CUSTOMER",
  "EMPLOYEE",
] as const;

type Type =
  (typeof TYPES)[number];

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

  agentType:
    "LOGISTICS_COMPANY",

  name: "",
  username: "",
  employeeCode: "",
};

export default function OnboardingPage() {
  const [type, setType] =
    useState<Type>("CLIENT");

  const [form, setForm] =
    useState<any>({
      ...initial,
    });

  const [message, setMessage] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  function set(
    field: string,
    value: string
  ) {
    setForm(
      (current: any) => ({
        ...current,
        [field]: value,
      })
    );
  }

  function switchType(
    next: Type
  ) {
    setType(next);
    setForm({ ...initial });
    setMessage("");
  }

  async function submit(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/onboarding",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                type,
                details: form,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save."
        );
      }

      if (
        type === "CLIENT" ||
        type === "AGENT"
      ) {
        setMessage(
          `${type} request ${data.requestNumber} created. ${
            data.emailSent
              ? "Finance and MD approval emails sent."
              : "SMTP is not configured, so email was not sent."
          }`
        );
      } else if (
        type === "EMPLOYEE"
      ) {
        setMessage(
          `Employee created. Username: ${data.username} | Temporary Password: ${data.temporaryPassword}`
        );
      } else {
        setMessage(
          "Customer created successfully."
        );
      }

      setForm({
        ...initial,
      });
    } catch (error: any) {
      setMessage(
        error.message
      );
    } finally {
      setSaving(false);
    }
  }

  const enquiry =
    type === "CLIENT" ||
    type === "AGENT";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Onboarding & Access
          </h1>

          <p className="mt-2 text-slate-500">
            Admin-controlled Client,
            Agent, Customer and
            Employee creation.
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
            onClick={() =>
              switchType(item)
            }
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

      <form
        onSubmit={submit}
        className="rounded-xl bg-white p-6 shadow-sm"
      >
        {type === "EMPLOYEE" ? (
          <Section title="Employee Details">
            <Field
              label="Name"
              value={form.name}
              required
              onChange={(v) =>
                set("name", v)
              }
            />

            <Field
              label="Username"
              value={form.username}
              onChange={(v) =>
                set("username", v)
              }
            />

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) =>
                set("email", v)
              }
            />

            <Field
              label="Phone Number"
              value={form.phone}
              onChange={(v) =>
                set("phone", v)
              }
            />

            <Field
              label="City"
              value={form.city}
              onChange={(v) =>
                set("city", v)
              }
            />

            <Field
              label="Airport of Operation"
              value={form.airport}
              onChange={(v) =>
                set("airport", v)
              }
            />

            <Field
              label="Destination"
              value={
                form.destination
              }
              onChange={(v) =>
                set(
                  "destination",
                  v
                )
              }
            />
          </Section>
        ) : (
          <>
            <Section title="Customer Details">
              <Field
                label="Company Name"
                value={
                  form.companyName
                }
                required
                onChange={(v) =>
                  set(
                    "companyName",
                    v
                  )
                }
              />

              <Field
                label="GSTIN"
                value={form.gstin}
                onChange={(v) =>
                  set("gstin", v)
                }
              />

              <Field
                label="PAN"
                value={form.pan}
                onChange={(v) =>
                  set("pan", v)
                }
              />

              <Field
                label="Contact Person"
                value={
                  form.contactPerson
                }
                onChange={(v) =>
                  set(
                    "contactPerson",
                    v
                  )
                }
              />

              <Field
                label="Designation"
                value={
                  form.designation
                }
                onChange={(v) =>
                  set(
                    "designation",
                    v
                  )
                }
              />

              <Field
                label="Mobile Number"
                value={form.phone}
                onChange={(v) =>
                  set("phone", v)
                }
              />

              <Field
                label="Email Address"
                type="email"
                value={form.email}
                required={enquiry}
                onChange={(v) =>
                  set("email", v)
                }
              />

              <Field
                label="Office Address"
                value={form.address}
                onChange={(v) =>
                  set("address", v)
                }
              />

              <Field
                label="City"
                value={form.city}
                onChange={(v) =>
                  set("city", v)
                }
              />

              <Field
                label="State"
                value={form.state}
                onChange={(v) =>
                  set("state", v)
                }
              />
            </Section>

            {enquiry && (
              <>
                <Section title="Business & Logistics Requirement">
                  {type ===
                    "AGENT" && (
                    <Select
                      label="Agent Type"
                      value={
                        form.agentType
                      }
                      options={[
                        [
                          "COURIER_COMPANY",
                          "Courier Company",
                        ],
                        [
                          "LOGISTICS_COMPANY",
                          "Logistics Company",
                        ],
                        [
                          "AGGREGATOR",
                          "Aggregator",
                        ],
                      ]}
                      onChange={(v) =>
                        set(
                          "agentType",
                          v
                        )
                      }
                    />
                  )}

                  <Field
                    label="Origin (City/Airport)"
                    value={
                      form.origin
                    }
                    onChange={(v) =>
                      set(
                        "origin",
                        v
                      )
                    }
                  />

                  <Field
                    label="Destination (City/Airport)"
                    value={
                      form.destination
                    }
                    onChange={(v) =>
                      set(
                        "destination",
                        v
                      )
                    }
                  />

                  <Select
                    label="Trip Type"
                    value={
                      form.tripType
                    }
                    options={[
                      [
                        "One-way",
                        "One-way",
                      ],
                      [
                        "Round Trip",
                        "Round Trip",
                      ],
                    ]}
                    onChange={(v) =>
                      set(
                        "tripType",
                        v
                      )
                    }
                  />

                  <Select
                    label="Shipment Frequency"
                    value={
                      form.shipmentFrequency
                    }
                    options={[
                      [
                        "Daily",
                        "Daily",
                      ],
                      [
                        "Weekly",
                        "Weekly",
                      ],
                      [
                        "Fortnightly",
                        "Fortnightly",
                      ],
                      [
                        "Monthly",
                        "Monthly",
                      ],
                      [
                        "Ad-hoc",
                        "Ad-hoc",
                      ],
                    ]}
                    onChange={(v) =>
                      set(
                        "shipmentFrequency",
                        v
                      )
                    }
                  />

                  <Field
                    label="Expected Start Date"
                    type="date"
                    value={
                      form.expectedStartDate
                    }
                    onChange={(v) =>
                      set(
                        "expectedStartDate",
                        v
                      )
                    }
                  />

                  <Select
                    label="Service Type"
                    value={
                      form.serviceType
                    }
                    options={[
                      [
                        "Airport to Airport",
                        "Airport to Airport",
                      ],
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
                      [
                        "Door to Door",
                        "Door to Door",
                      ],
                    ]}
                    onChange={(v) =>
                      set(
                        "serviceType",
                        v
                      )
                    }
                  />

                  <Field
                    label="Value Added Services"
                    value={
                      form.valueAddedServices
                    }
                    placeholder="Pickup, Delivery, Packaging, Insurance, POD, Reverse Logistics, COD"
                    onChange={(v) =>
                      set(
                        "valueAddedServices",
                        v
                      )
                    }
                  />
                </Section>

                <Section title="Cargo Details">
                  <Field
                    label="Commodity / Industry"
                    value={
                      form.commodity
                    }
                    onChange={(v) =>
                      set(
                        "commodity",
                        v
                      )
                    }
                  />

                  <Select
                    label="Type of Contents"
                    value={
                      form.contentsType
                    }
                    options={[
                      [
                        "General Cargo",
                        "General Cargo",
                      ],
                      [
                        "Perishable",
                        "Perishable",
                      ],
                      [
                        "Hazmat/DG",
                        "Hazmat/DG",
                      ],
                      [
                        "Fragile",
                        "Fragile",
                      ],
                      [
                        "Temperature-Controlled",
                        "Temperature-Controlled",
                      ],
                    ]}
                    onChange={(v) =>
                      set(
                        "contentsType",
                        v
                      )
                    }
                  />

                  <Field
                    label="No. of Packages"
                    value={
                      form.packageCount
                    }
                    onChange={(v) =>
                      set(
                        "packageCount",
                        v
                      )
                    }
                  />

                  <Field
                    label="Dimensions per Package"
                    value={
                      form.dimensions
                    }
                    onChange={(v) =>
                      set(
                        "dimensions",
                        v
                      )
                    }
                  />

                  <Field
                    label="Average Weight per Package"
                    value={
                      form.averageWeight
                    }
                    onChange={(v) =>
                      set(
                        "averageWeight",
                        v
                      )
                    }
                  />

                  <Field
                    label="Total Weight per Shipment"
                    value={
                      form.totalWeight
                    }
                    onChange={(v) =>
                      set(
                        "totalWeight",
                        v
                      )
                    }
                  />

                  <Field
                    label="Monthly Committed Volume"
                    value={
                      form.monthlyVolume
                    }
                    onChange={(v) =>
                      set(
                        "monthlyVolume",
                        v
                      )
                    }
                  />

                  <Field
                    label="Annual Committed Volume"
                    value={
                      form.annualVolume
                    }
                    onChange={(v) =>
                      set(
                        "annualVolume",
                        v
                      )
                    }
                  />
                </Section>

                <Section title="Commercial Details">
                  <Field
                    label="Current Airline / Forwarder"
                    value={
                      form.currentIncumbent
                    }
                    onChange={(v) =>
                      set(
                        "currentIncumbent",
                        v
                      )
                    }
                  />

                  <Field
                    label="Current Rate Paid (₹/Kg)"
                    value={
                      form.currentRate
                    }
                    onChange={(v) =>
                      set(
                        "currentRate",
                        v
                      )
                    }
                  />

                  <Field
                    label="Current Transit Time"
                    value={
                      form.transitTime
                    }
                    onChange={(v) =>
                      set(
                        "transitTime",
                        v
                      )
                    }
                  />

                  <Field
                    label="Expected Monthly Billing"
                    value={
                      form.expectedMonthlyBilling
                    }
                    onChange={(v) =>
                      set(
                        "expectedMonthlyBilling",
                        v
                      )
                    }
                  />

                  <Field
                    label="Credit Days Requested"
                    value={
                      form.creditDays
                    }
                    onChange={(v) =>
                      set(
                        "creditDays",
                        v
                      )
                    }
                  />

                  <Select
                    label="Billing Cycle"
                    value={
                      form.billingCycle
                    }
                    options={[
                      [
                        "Weekly",
                        "Weekly",
                      ],
                      [
                        "Fortnightly",
                        "Fortnightly",
                      ],
                      [
                        "Monthly",
                        "Monthly",
                      ],
                    ]}
                    onChange={(v) =>
                      set(
                        "billingCycle",
                        v
                      )
                    }
                  />

                  <div className="md:col-span-2">
                    <TextArea
                      label="Pain Points / Challenges"
                      value={
                        form.painPoints
                      }
                      onChange={(v) =>
                        set(
                          "painPoints",
                          v
                        )
                      }
                    />
                  </div>
                </Section>
              </>
            )}
          </>
        )}

        {message && (
          <div className="mt-6 rounded-lg bg-slate-100 p-4">
            {message}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-7 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : `Create ${type}`}
          </button>
        </div>
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
      <h2 className="mb-4 border-b pb-3 text-lg font-semibold">
        {title}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {children}
      </div>
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
  onChange: (
    value: string
  ) => void;
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
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
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
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">
        {label}
      </span>

      <select
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-300 px-3 py-3"
      >
        <option value="">
          Select
        </option>

        {options.map(
          ([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          )
        )}
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
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">
        {label}
      </span>

      <textarea
        rows={4}
        value={value || ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-300 px-3 py-3"
      />
    </label>
  );
}
