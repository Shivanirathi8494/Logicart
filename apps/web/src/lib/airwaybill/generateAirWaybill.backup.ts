import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs/promises";
import path from "node:path";

function clean(value: unknown): string {
  return value == null ? "" : String(value);
}

function draw(
  page: any,
  font: any,
  text: string,
  x: number,
  y: number,
  size = 7,
) {
  if (!text) return;

  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawLines(
  page: any,
  font: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size = 7,
  lineHeight = 9,
) {
  const words = clean(text).split(/\s+/).filter(Boolean);

  let line = "";
  let currentY = y;

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;

    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      draw(page, font, line, x, currentY, size);
      currentY -= lineHeight;
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    draw(page, font, line, x, currentY, size);
  }
}

export async function generateAirWaybill(shipment: any) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "air-waybill-template.pdf",
  );

  const template = await fs.readFile(templatePath);
  const pdf = await PDFDocument.load(template);

  const pages = pdf.getPages();

  if (pages.length < 2) {
    throw new Error(
      "Alliance Air AWB template must contain 2 pages.",
    );
  }

  const page = pages[0];

  const font = await pdf.embedFont(
    StandardFonts.Helvetica,
  );

  const bold = await pdf.embedFont(
    StandardFonts.HelveticaBold,
  );

  /*
   * Alliance Air A4 template.
   *
   * IMPORTANT:
   * The PDF template supplies all borders, labels,
   * spacing and Alliance Air branding.
   *
   * We only overlay shipment data.
   */

  // --------------------------------------------------
  // TOP AIR WAYBILL HEADER
  // --------------------------------------------------

  const trackingNumber = clean(shipment.trackingNumber);
  const prefix = clean(shipment.airline?.iataPrefix) || "296";
  const origin = clean(shipment.origin);

  const serial = trackingNumber.includes("-")
    ? trackingNumber.split("-").slice(1).join("-")
    : trackingNumber;

  const headerLeft = `${prefix} | ${origin} | ${serial}`;

  const dateValue = shipment.bookingDate
    ? new Date(shipment.bookingDate)
    : new Date();

  const dd = String(dateValue.getDate()).padStart(2, "0");
  const mm = String(dateValue.getMonth() + 1).padStart(2, "0");
  const yyyy = dateValue.getFullYear();

  const headerDate = `${dd}/${mm}/${yyyy}`;

  /*
   * Alliance Air template:
   *
   * Page: 594.96 x 841.92 pt
   *
   * Header band is immediately above the first
   * horizontal form line.
   */

  const HEADER_Y = 808;

  draw(
    page,
    bold,
    headerLeft,
    18,
    HEADER_Y,
    8,
  );

  draw(
    page,
    bold,
    `Final Copy: Updated on ${headerDate} Printed on ${headerDate}`,
    205,
    HEADER_Y,
    7,
  );

  draw(
    page,
    bold,
    trackingNumber,
    500,
    HEADER_Y,
    8,
  );

  // --------------------------------------------------
  // SHIPPER
  // --------------------------------------------------

  draw(
    page,
    bold,
    clean(shipment.senderName),
    50,
    775,
    7,
  );

  drawLines(
    page,
    font,
    clean(shipment.senderAddress),
    50,
    764,
    235,
    7,
    9,
  );

  draw(
    page,
    font,
    `${clean(shipment.senderCity)}, ${clean(shipment.senderState)}`,
    50,
    730,
    7,
  );

  draw(
    page,
    font,
    `PIN: ${clean(shipment.senderPincode)}`,
    50,
    720,
    7,
  );

  draw(
    page,
    font,
    `GSTIN: ${clean(shipment.senderGSTIN)}`,
    50,
    710,
    7,
  );

  draw(
    page,
    font,
    `Mob: ${clean(shipment.senderPhone)}`,
    50,
    700,
    7,
  );

  // --------------------------------------------------
  // CONSIGNEE
  // --------------------------------------------------

  draw(
    page,
    bold,
    clean(shipment.receiverName),
    50,
    680,
    7,
  );

  drawLines(
    page,
    font,
    clean(shipment.receiverAddress),
    50,
    669,
    235,
    7,
    9,
  );

  draw(
    page,
    font,
    `${clean(shipment.receiverCity)}, ${clean(shipment.receiverState)}`,
    50,
    635,
    7,
  );

  draw(
    page,
    font,
    `PIN: ${clean(shipment.receiverPincode)}`,
    50,
    625,
    7,
  );

  draw(
    page,
    font,
    `GSTIN: ${clean(shipment.receiverGSTIN)}`,
    50,
    615,
    7,
  );

  draw(
    page,
    font,
    `Mob: ${clean(shipment.receiverPhone)}`,
    50,
    605,
    7,
  );

  // --------------------------------------------------
  // ISSUING CARRIER
// --------------------------------------------------

draw(
  page,
  font,
  "Alliance Air Aviation Limited",
  42,
  585,
  7,
);

// --------------------------------------------------
// IATA / ACCOUNT
// --------------------------------------------------

draw(
  page,
  font,
  clean(shipment.airline?.iataDesignator) || "9I",
  42,
  555,
  7,
);

// --------------------------------------------------
// DEPARTURE / ROUTING
// --------------------------------------------------

// Airport of departure
draw(
  page,
  bold,
  clean(shipment.origin),
  45,
  525,
  8,
);

// First carrier — this belongs in the narrow
// "By First Carrier" field.
draw(
  page,
  font,
  "Alliance Air",
  88,
  495,
  6,
);

// --------------------------------------------------
// DESTINATION / FLIGHT
// --------------------------------------------------

// Destination is inside the large boxed
// Airport of Destination field.
draw(
  page,
  bold,
  clean(shipment.destination),
  55,
  465,
  8,
);

// Flight number
draw(
  page,
  bold,
  clean(shipment.flightNumber),
  215,
  465,
  7,
);

// Requested/flight date
const bookingDate = shipment.bookingDate
  ? new Date(shipment.bookingDate).toLocaleDateString("en-IN")
  : "";

draw(
  page,
  font,
  bookingDate,
  315,
  465,
  7,
);

// --------------------------------------------------
// HANDLING INFORMATION
// --------------------------------------------------

drawLines(
  page,
  font,
  clean(shipment.contents),
  50,
  430,
  500,
  7,
  9,
);

// --------------------------------------------------
// CARGO TABLE
// --------------------------------------------------

const packages = Array.isArray(shipment.packages)
  ? shipment.packages
  : [];

// No. of Pieces
draw(
  page,
  font,
  clean(shipment.packageCount),
  55,
  395,
  8,
);

// Gross / Actual Weight
draw(
  page,
  font,
  `${clean(shipment.actualWeight)} KG`,
  105,
  395,
  7,
);

// Chargeable Weight
draw(
  page,
  font,
  `${clean(shipment.chargeableWeight)} KG`,
  190,
  395,
  7,
);

// Rate
const chargeableWeight = Number(
  shipment.chargeableWeight || 0,
);

const freight = Number(
  shipment.freight || 0,
);

const rate =
  chargeableWeight > 0
    ? freight / chargeableWeight
    : 0;

draw(
  page,
  font,
  rate.toFixed(2),
  265,
  395,
  7,
);

// Charge
draw(
  page,
  font,
  `INR ${freight.toFixed(2)}`,
  305,
  395,
  7,
);

// Total
draw(
  page,
  bold,
  `INR ${Number(shipment.total || 0).toFixed(2)}`,
  360,
  395,
  7,
);

// --------------------------------------------------
// GOODS / DIMENSIONS
// --------------------------------------------------

drawLines(
  page,
  font,
  clean(shipment.contents),
  430,
  395,
  125,
  7,
  9,
);

let dimensionY = 365;

packages.slice(0, 8).forEach((pkg: any) => {
  draw(
    page,
    font,
    `${clean(pkg.length)} × ${clean(pkg.width)} × ${clean(pkg.height)} cm`,
    430,
    dimensionY,
    6,
  );

  dimensionY -= 10;
});

// --------------------------------------------------
// TAX
// --------------------------------------------------

draw(
  page,
  font,
  `INR ${Number(shipment.gst || 0).toFixed(2)}`,
  270,
  175,
  7,
);

// --------------------------------------------------
// PAGE 2


  // --------------------------------------------------
  //
  // Intentionally untouched.
  // Alliance Air conditions remain exactly as
  // supplied in the original template.
  //

  return pdf.save();
}
