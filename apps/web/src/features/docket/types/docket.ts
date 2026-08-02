export interface Party {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Shipment {
  packages: number;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  length: number;
  width: number;
  height: number;
  declaredValue: number;
  contents: string;
}

export type PaymentType =
  | "PAID"
  | "TO_PAY"
  | "CREDIT";

export type PaymentMode =
  | "CASH"
  | "UPI"
  | "CARD"
  | "BANK"
  | "CHEQUE"
  | "CREDIT";

export interface Payment {
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  freight: number;
  gst: number;
  discount: number;
  total: number;
}

export interface Docket {
  docketNumber: string;
  customerReference?: string;

  bookingDate: string;

  origin: string;
  destination: string;

  serviceType: string;
  priority: string;

  sender: Party;

  receiver: Party;

  shipment: Shipment;

  payment: Payment;

  remarks?: string;
}
