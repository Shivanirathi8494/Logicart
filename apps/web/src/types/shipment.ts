export interface PackageDetail {
  length: number;
  width: number;
  height: number;
  weight: number;

  // UI-only grouping field.
  // Before saving/pricing, grouped packages are expanded
  // into individual physical package records.
  quantity?: number;
}

export interface CreateShipmentRequest {
  trackingNumber: string;

  bookingDate: string;

  clientId?: string;
  customerId: string;
  origin: string;
  destination: string;
  serviceType: string;

  deliveryType: "DOOR_TO_DOOR" | "AIRPORT_DELIVERY";

  airlineId: string;
  flightNumber: string;

  scheduledDeparture: string;
  scheduledArrival: string;
  aircraftType: string;
  departureTerminal: string;
  arrivalTerminal: string;

  // Sender
  senderName: string;
  senderPhone: string;
  senderGSTIN: string;
  senderPincode: string;
  invoiceNumber: string;
  invoiceValue: string;
  senderState: string;
  senderCity: string;
  senderAddress: string;

  // Receiver
  receiverName: string;
  receiverPhone: string;
  receiverGSTIN: string;
  receiverPincode: string;
  receiverState: string;
  receiverCity: string;
  receiverAddress: string;

  packageCount: number;

  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;

  contents: string;

  freight: number;
  gst: number;
  total: number;

  tariffError?: string;

  paymentReference: string;
  remarks: string;

  packages: PackageDetail[];
}
