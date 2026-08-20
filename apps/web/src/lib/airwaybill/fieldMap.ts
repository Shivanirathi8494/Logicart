export type TextAlign =
  | "left"
  | "center"
  | "right";

export type AwbField = {
  x: number;
  y: number;
  width: number;
  height: number;

  fontSize: number;
  minFontSize: number;

  align?: TextAlign;

  maxLines?: number;
  lineHeight?: number;

  paddingX?: number;
  paddingY?: number;

  bold?: boolean;
};

export const FIELD_MAP = {
  header: {
    airlineCode: {
      x: 28,
      y: 808,
      width: 40,
      height: 12,
      fontSize: 5.5,
      minFontSize: 4.8,
      align: "center",
      bold: true,
    },

    origin: {
      x: 59,
      y: 808,
      width: 45,
      height: 12,
      fontSize: 5.5,
      minFontSize: 4.8,
      align: "center",
      bold: true,
    },

    serial: {
      x: 80,
      y: 808,
      width: 90,
      height: 12,
      fontSize: 5.8,
      minFontSize: 4.8,
      align: "center",
      bold: true,
    },

    awbNumberRight: {
      x: 478,
      y: 820,
      width: 98,
      height: 12,
      fontSize: 6.5,
      minFontSize: 5,
      align: "right",
      bold: true,
    },
  },

  shipper: {
    name: {
      x: 38,
      y: 756,
      width: 205,
      height: 10,
      fontSize: 8,
      minFontSize: 5.5,
      bold: true,
    },

    details: {
      x: 38,
      y: 735,
      width: 205,
      height: 72,
      fontSize: 6.5,
      minFontSize: 5,
      maxLines: 4,
      lineHeight: 9,
    },

    account: {
      x: 165,
      y: 778,
      width: 115,
      height: 12,
      fontSize: 5.8,
      minFontSize: 4.8,
      align: "center",
      bold: true,
    },
  },

  consignee: {
    name: {
      x: 38,
      y: 674,
      width: 205,
      height: 10,
      fontSize: 8,
      minFontSize: 5.5,
      bold: true,
    },

    details: {
      x: 38,
      y: 652,
      width: 205,
      height: 68,
      fontSize: 6.5,
      minFontSize: 5,
      maxLines: 4,
      lineHeight: 9,
    },

    account: {
      x: 165,
      y: 687,
      width: 115,
      height: 12,
      fontSize: 5.8,
      minFontSize: 4.8,
      align: "center",
      bold: true,
    },
  },

  agent: {
    name: {
      x: 38,
      y: 579,
      width: 95,
      height: 9,
      fontSize: 6.5,
      minFontSize: 5,
      bold: true,
    },

    city: {
      x: 120,
      y: 579,
      width: 45,
      height: 9,
      fontSize: 6.2,
      minFontSize: 4.8,
      align: "center",
    },

    iataCode: {
      x: 165,
      y: 558,
      width: 80,
      height: 9,
      fontSize: 6.5,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    account: {
      x: 195,
      y: 558,
      width: 80,
      height: 9,
      fontSize: 5.5,
      minFontSize: 5,
      align: "center",
      bold: true,
    },
  },

  reference: {
    number: {
      x: 280,
      y: 540,
      width: 105,
      height: 12,
      fontSize: 5,
      minFontSize: 5,
      align: "center",
      bold: true,
    },
  },

  routing: {
    origin: {
      x: 22,
      y: 514,
      width: 40,
      height: 10,
      fontSize: 5.8,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    carrier: {
      x: 50,
      y: 514,
      width: 85,
      height: 10,
      fontSize: 5.2,
      minFontSize: 4.2,
      align: "center",
      bold: true,
    },

    routingDestination: {
      x: 132,
      y: 514,
      width: 60,
      height: 10,
      fontSize: 5.8,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    currency: {
      x: 292,
      y: 510,
      width: 37,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.6,
      align: "center",
      bold: true,
    },

    wtVal: {
      x: 400,
      y: 500,
      width: 35,
      height: 10,
      fontSize: 5.0,
      minFontSize: 4.2,
      align: "center",
      bold: true,
    },

    other: {
      x: 435,
      y: 503,
      width: 40,
      height: 10,
      fontSize: 5.2,
      minFontSize: 4.2,
      align: "center",
      bold: true,
    },
  },

  flight: {
    destination: {
      x: 7,
      y: 477,
      width: 142,
      height: 10,
      fontSize: 6.5,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    number: {
      x: 157,
      y: 477,
      width: 75,
      height: 10,
      fontSize: 6.2,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    date: {
      x: 235,
      y: 481,
      width: 80,
      height: 10,
      fontSize: 6.2,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    carrierUse: {
      x: 300,
      y: 479,
      width: 75,
      height: 9,
      fontSize: 4.6,
      minFontSize: 3.8,
      align: "center",
    },

    insurance: {
      x: 455,
      y: 479,
      width: 60,
      height: 9,
      fontSize: 4.5,
      minFontSize: 3.8,
      align: "center",
    },
  },

  handling: {
    text: {
      x: 24,
      y: 433,
      width: 415,
      height: 15,
      fontSize: 5.0,
      minFontSize: 4.2,
      maxLines: 2,
      lineHeight: 6,
    },

    sci: {
      x: 450,
      y: 417,
      width: 125,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.5,
      align: "center",
      bold: true,
    },
  },

  cargo: {
    pieces: {
      x: 18,
      y: 298,
      width: 44,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    grossWeight: {
      x: 62,
      y: 298,
      width: 56,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
    },

    unit: {
      x: 113,
      y: 298,
      width: 24,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
    },

    rateCommodity: {
      x: 129,
      y: 298,
      width: 63,
      height: 10,
      fontSize: 6.5,
      minFontSize: 4.8,
      align: "center",
    },

    chargeableWeight: {
      x: 185,
      y: 298,
      width: 60,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
    },

    rate: {
      x: 238,
      y: 298,
      width: 55,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
    },

    charge: {
      x: 271,
      y: 298,
      width: 55,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    total: {
      x: 323,
      y: 298,
      width: 60,
      height: 10,
      fontSize: 7,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    goods: {
      x: 442,
      y: 298,
      width: 127,
      height: 75,
      fontSize: 6.2,
      minFontSize: 4.8,
      maxLines: 7,
      lineHeight: 8,
      bold: true,
    },
  },

  accounting: {
    weightCharge: {
      x: 20,
      y: 211,
      width: 103,
      height: 10,
      fontSize: 5.8,
      minFontSize: 4.8,
      align: "center",
    },

    collectWeightCharge: {
      x: 126,
      y: 211,
      width: 103,
      height: 10,
      fontSize: 5.8,
      minFontSize: 4.8,
      align: "center",
    },

    valuationCharge: {
      x: 20,
      y: 184,
      width: 209,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.6,
      align: "center",
    },

    tax: {
      x: 16,
      y: 168,
      width: 209,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.6,
      align: "center",
    },

    otherDueAgent: {
      x: 16,
      y: 143,
      width: 209,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.6,
      align: "center",
    },

    otherDueCarrier: {
      x: 16,
      y: 118,
      width: 209,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.6,
      align: "center",
    },

    totalPrepaid: {
      x: 20,
      y: 82,
      width: 103,
      height: 10,
      fontSize: 5.8,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    totalCollect: {
      x: 126,
      y: 82,
      width: 103,
      height: 10,
      fontSize: 5.8,
      minFontSize: 5,
      align: "center",
      bold: true,
    },

    currency: {
      x: 20,
      y: 62,
      width: 103,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.5,
      align: "center",
    },

    destinationCurrency: {
      x: 126,
      y: 62,
      width: 103,
      height: 10,
      fontSize: 5.2,
      minFontSize: 4.5,
      align: "center",
    },
  },


    chargesAtDestination: {
      x: 100,
      y: 200,
      width: 103,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.5,
      align: "center",
    },

    totalCollectCharges: {
      x: 100,
      y: 200,
      width: 103,
      height: 10,
      fontSize: 5.5,
      minFontSize: 4.5,
      align: "center",
    },

  certification: {
    executedOn: {
      x: 250,
      y: 60,
      width: 90,
      height: 10,
      fontSize: 6,
      minFontSize: 4.8,
    },

    place: {
      x: 355,
      y: 60,
      width: 55,
      height: 10,
      fontSize: 6,
      minFontSize: 4.8,
      align: "center",
    },

    agent: {
      x: 455,
      y: 60,
      width: 110,
      height: 10,
      fontSize: 6,
      minFontSize: 4.8,
      align: "center",
      bold: true,
    },
  },
} as const;
