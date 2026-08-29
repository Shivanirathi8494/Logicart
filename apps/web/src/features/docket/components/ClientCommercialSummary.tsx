"use client";

type ClientPricingPreview = {
  client: {
    id: string;
    code: string;
    companyName: string;
    billingType: string;
  };

  weights: {
    actualWeight: number;
    volumetricWeight: number;
    chargeableWeight: number;
  };

  pricing: {
    pricingSource: string;
    rateContractId: string | null;
    contractVersion: number | null;
    serviceType: string;
    ratePerKg: number;
    calculatedFreight: number;
    minimumFreight: number;
    freightAmount: number;
    awbCharge: number;
    handlingCharge: number;
    pickupCharge: number;
    deliveryCharge: number;
    fuelSurchargePct: number;
    fuelSurcharge: number;
    subtotal: number;
    gstPct: number;
    gstAmount: number;
    totalAmount: number;
  };

  wallet: {
    balance: number;
    afterBooking: number;
    sufficientBalance: boolean;
  };
};

type Props = {
  preview: ClientPricingPreview | null;
  loading: boolean;
  error: string;
};

function money(value: number | undefined) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function billingLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ClientCommercialSummary({
  preview,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#0b2340] sm:text-xl">
          Client Commercial
        </h2>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          Calculating your contracted rate...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#0b2340] sm:text-xl">
          Client Commercial
        </h2>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
          {error}
        </div>
      </section>
    );
  }

  if (!preview) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#0b2340] sm:text-xl">
          Client Commercial
        </h2>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          Select the route and enter package dimensions and weight to calculate
          your contracted price.
        </div>
      </section>
    );
  }

  const prepaid = preview.client.billingType === "PREPAID_WALLET";

  const contracted = preview.pricing.pricingSource === "CLIENT_RATE_CARD";

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#0b2340] sm:text-xl">
            Client Commercial
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {contracted
              ? "Your negotiated Logicarts rate is applied automatically."
              : "Standard airline rate is applied because this route has no negotiated client rate."}
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {contracted
            ? `Contract v${preview.pricing.contractVersion}`
            : "Standard Airline Rate"}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Info label="Client ID" value={preview.client.code} />

        <Info label="Company" value={preview.client.companyName} />

        <Info
          label="Billing Model"
          value={billingLabel(preview.client.billingType)}
        />

        <Info label="Service Type" value={preview.pricing.serviceType} />
      </div>

      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold text-slate-800">
          {contracted ? "Contracted Pricing" : "Standard Airline Pricing"}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Amount
            label="Chargeable Weight"
            value={`${preview.weights.chargeableWeight.toFixed(2)} Kg`}
          />

          <Amount label="Rate / Kg" value={money(preview.pricing.ratePerKg)} />

          <Amount
            label="Freight"
            value={money(preview.pricing.freightAmount)}
          />

          <Amount label="AWB Charge" value={money(preview.pricing.awbCharge)} />

          <Amount
            label="Handling"
            value={money(preview.pricing.handlingCharge)}
          />

          <Amount label="Pickup" value={money(preview.pricing.pickupCharge)} />

          <Amount
            label="Delivery"
            value={money(preview.pricing.deliveryCharge)}
          />

          <Amount
            label={`Fuel (${preview.pricing.fuelSurchargePct}%)`}
            value={money(preview.pricing.fuelSurcharge)}
          />

          <Amount label="Subtotal" value={money(preview.pricing.subtotal)} />

          <Amount
            label={`GST (${preview.pricing.gstPct}%)`}
            value={money(preview.pricing.gstAmount)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-300">Booking Total</span>

          <span className="text-2xl font-bold">
            {money(preview.pricing.totalAmount)}
          </span>
        </div>
      </div>

      {prepaid && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <WalletAmount label="Wallet Before" value={preview.wallet.balance} />

          <WalletAmount
            label="Booking Debit"
            value={preview.pricing.totalAmount}
          />

          <WalletAmount
            label="Wallet After"
            value={preview.wallet.afterBooking}
            warning={!preview.wallet.sufficientBalance}
          />
        </div>
      )}

      {prepaid && !preview.wallet.sufficientBalance && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Insufficient prepaid wallet balance. Please top up your wallet before
          creating this docket.
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Pricing is read-only. The final amount is recalculated by the server
        when the docket is created.
      </p>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-slate-50 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="mt-1 font-semibold text-slate-900">{value || "—"}</div>
    </div>
  );
}

function Amount({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-slate-500">{label}</div>

      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function WalletAmount({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        warning ? "border-red-200 bg-red-50" : "bg-slate-50"
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>

      <div
        className={`mt-1 text-lg font-bold ${
          warning ? "text-red-700" : "text-slate-900"
        }`}
      >
        {money(value)}
      </div>
    </div>
  );
}

export type { ClientPricingPreview };
