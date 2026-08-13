export interface PackageDetail {
  length: number;
  width: number;
  height: number;
}

export interface CreateShipmentRequest {
  trackingNumber: string;

  bookingDate: string;

  origin: string;
  destination: string;
  airlineId: string;
  flightNumber: string;

  // Sender
  senderName: string;
  senderPhone: string;
  senderGSTIN: string;
  senderPincode: string;
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
