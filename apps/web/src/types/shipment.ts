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

  senderName: string;
  senderPhone: string;
  senderAddress: string;

  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;

  packageCount: number;

  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;

  contents: string;

  freight: number;
  gst: number;
  total: number;

  paymentReference: string;
  remarks: string;

  packages: PackageDetail[];
}
