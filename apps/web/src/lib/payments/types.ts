export type PaymentProviderName = "RAZORPAY" | "CASHFREE" | "DUMMY";

export type CreatePaymentOrderInput = {
  rechargeId: string;
  referenceNumber: string;
  amount: number;
  currency: "INR";

  client: {
    id: string;
    code: string;
    companyName: string;
    email?: string | null;
    phone?: string | null;
  };
};

export type CreatePaymentOrderResult = {
  provider: PaymentProviderName;
  providerOrderId: string;

  amount: number;
  currency: "INR";

  checkout: {
    keyId?: string;
    orderId: string;
  };
};

export type VerifiedPayment = {
  provider: PaymentProviderName;

  providerOrderId: string;
  providerPaymentId: string;

  amount: number;
  currency: "INR";

  paidAt: Date;
};

export interface PaymentProvider {
  readonly name: PaymentProviderName;

  createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<CreatePaymentOrderResult>;

  verifyWebhook(rawBody: string, signature: string): Promise<VerifiedPayment>;
}
