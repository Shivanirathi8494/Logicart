import type { PaymentProviderName } from "./types";

/*
 * Online wallet payments are intentionally disabled until
 * a real payment provider has been configured.
 *
 * Never enable online payments merely by changing frontend UI.
 * Provider credentials + webhook verification must exist first.
 */

export function onlinePaymentsEnabled() {
  return process.env.ONLINE_PAYMENTS_ENABLED === "true";
}

export function getConfiguredPaymentProvider(): PaymentProviderName | null {
  const provider = process.env.PAYMENT_PROVIDER?.trim().toUpperCase();

  if (
    provider === "RAZORPAY" ||
    provider === "CASHFREE" ||
    provider === "DUMMY"
  ) {
    return provider;
  }

  return null;
}

export function getPaymentConfiguration() {
  return {
    enabled: onlinePaymentsEnabled(),
    provider: getConfiguredPaymentProvider(),
  };
}
