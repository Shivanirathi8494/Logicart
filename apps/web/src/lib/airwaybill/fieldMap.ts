export const FIELD_MAP = {
  shipper: {
    name: { x: 50, y: 775 },
    address: { x: 50, y: 764 },
    account: { x: 335, y: 758 },
  },

  consignee: {
    name: { x: 50, y: 680 },
    address: { x: 50, y: 669 },
    account: { x: 335, y: 660 },
  },

  routing: {
    origin: { x: 43, y: 507 },
    carrier: { x: 87, y: 507 },
    destination: { x: 50, y: 478 },
    flight: { x: 270, y: 478 },
    date: { x: 435, y: 478 },
  },

  handling: {
    text: { x: 42, y: 447 },
  },

  cargo: {
    pieces: { x: 57, y: 392 },
    grossWeight: { x: 96, y: 392 },
    chargeableWeight: { x: 190, y: 392 },
    rate: { x: 255, y: 392 },
    charge: { x: 292, y: 392 },
    total: { x: 365, y: 392 },
    goods: { x: 430, y: 392 },
  },

  accounting: {
    freight: { x: 125, y: 173 },
    gst: { x: 125, y: 150 },
    total: { x: 125, y: 127 },
  },
};
