import { getPaymentConfiguration } from "./config";

import type { PaymentProvider } from "./types";

/*
 * Provider implementations will be registered here when
 * we connect a real gateway.
 *
 * Examples:
 *
 *   RazorpayPaymentProvider
 *   CashfreePaymentProvider
 *
 * Wallet/recharge business logic should depend on this
 * abstraction rather than importing a gateway SDK directly.
 */

export function getPaymentProvider(): PaymentProvider {
  const config = getPaymentConfiguration();

  if (!config.enabled) {
    throw new Error("ONLINE_PAYMENTS_DISABLED");
  }

  if (!config.provider) {
    throw new Error("PAYMENT_PROVIDER_NOT_CONFIGURED");
  }

  /*
   * We deliberately do NOT return a fake provider here.
   *
   * When a real provider is integrated, instantiate it
   * based on config.provider.
   */
  throw new Error(`PAYMENT_PROVIDER_NOT_IMPLEMENTED:${config.provider}`);
}
