import { CreateShipmentRequest } from "@/types/shipment";

export const initialShipment: CreateShipmentRequest = {

  trackingNumber: "",

  bookingDate: new Date().toISOString().split("T")[0],

  origin: "",
  destination: "",

  // Sender
  senderName: "",
  senderPhone: "",
  senderGSTIN: "",
  senderPincode: "",
  senderState: "",
  senderCity: "",
  senderAddress: "",

  // Receiver
  receiverName: "",
  receiverPhone: "",
  receiverGSTIN: "",
  receiverPincode: "",
  receiverState: "",
  receiverCity: "",
  receiverAddress: "",

  packageCount: 1,

  actualWeight: 0,
  volumetricWeight: 0,
  chargeableWeight: 0,

  contents: "",

  freight: 0,
  gst: 0,
  total: 0,

  paymentReference: "",
  remarks: "",

  packages: [
    {
      length: 0,
      width: 0,
      height: 0,
    },
  ],

};
