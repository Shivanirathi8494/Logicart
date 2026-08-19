import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import fs from "node:fs/promises";
import path from "node:path";

type Align = "left" | "center" | "right";

function clean(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/→/g, "->")
    .replace(/×/g, "x");
}

function amount(value: unknown): string {
  return Number(value || 0).toFixed(2);
}

function formatDate(value: unknown): string {
  if (!value) {
    return "";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    timeZone: "Asia/Kolkata",
  });
}

function formatTime(value: unknown): string {
  if (!value) {
    return "";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function drawCell(
  page: any,
  font: any,
  value: unknown,
  left: number,
  right: number,
  y: number,
  size = 7,
  align: Align = "left",
) {
  const text = clean(value);

  if (!text) {
    return;
  }

  let actualSize = size;
  const availableWidth = Math.max(1, right - left - 6);

  while (
    actualSize > 4.5 &&
    font.widthOfTextAtSize(text, actualSize) > availableWidth
  ) {
    actualSize -= 0.25;
  }

  const width =
    font.widthOfTextAtSize(text, actualSize);

  let x = left + 3;

  if (align === "center") {
    x = left + (right - left - width) / 2;
  }

  if (align === "right") {
    x = right - width - 3;
  }

  page.drawText(text, {
    x,
    y,
    size: actualSize,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawWrapped(
  page: any,
  font: any,
  value: unknown,
  x: number,
  y: number,
  maxWidth: number,
  size = 7,
  lineHeight = 9,
  maxLines = 4,
) {
  const text = clean(value);

  if (!text) {
    return;
  }

  const words = text.split(/\s+/).filter(Boolean);

  let line = "";
  let currentY = y;
  let linesWritten = 0;

  for (const word of words) {
    const candidate =
      line.length > 0
        ? `${line} ${word}`
        : word;

    if (
      line &&
      font.widthOfTextAtSize(candidate, size) >
        maxWidth
    ) {
      page.drawText(line, {
        x,
        y: currentY,
        size,
        font,
        color: rgb(0, 0, 0),
      });

      linesWritten++;

      if (linesWritten >= maxLines) {
        return;
      }

      currentY -= lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line && linesWritten < maxLines) {
    page.drawText(line, {
      x,
      y: currentY,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  }
}

/*
 * IMPORTANT
 * ---------
 * These coordinates map shipment DATA into the
 * existing Alliance Air template.
 *
 * We intentionally do NOT redraw the IATA form,
 * borders, labels or Alliance Air branding.
 */
const F = {
  header: {
    left: [18, 175, 808] as const,
    date: [220, 435, 808] as const,
    awb: [460, 575, 808] as const,
  },

  shipper: {
    name: [48, 280, 775] as const,
    addressX: 48,
    addressY: 761,
    addressW: 225,
    city: [48, 280, 727] as const,
    pin: [48, 280, 717] as const,
    gst: [48, 280, 707] as const,
    phone: [48, 280, 697] as const,
  },

  consignee: {
    name: [48, 280, 680] as const,
    addressX: 48,
    addressY: 666,
    addressW: 225,
    city: [48, 280, 632] as const,
    pin: [48, 280, 622] as const,
    gst: [48, 280, 612] as const,
    phone: [48, 280, 602] as const,
  },

  agent: {
    name: [45, 285, 555] as const,
    city: [45, 285, 544] as const,
    code: [45, 150, 524] as const,
    reference: [405, 555, 524] as const,
  },

  route: {
    origin: [40, 78, 505] as const,
    carrier: [78, 165, 505] as const,
    destination: [40, 155, 476] as const,
    flight: [225, 325, 476] as const,
    date: [325, 415, 476] as const,
  },

  handling: {
    x: 42,
    y: 445,
    width: 510,
  },

  cargo: {
    pieces: [40, 75, 389] as const,
    gross: [75, 125, 389] as const,
    kg: [125, 145, 389] as const,
    rateClass: [145, 170, 389] as const,
    commodity: [170, 215, 389] as const,
    chargeable: [215, 267, 389] as const,
    rate: [267, 318, 389] as const,
    charge: [318, 382, 389] as const,
    total: [382, 445, 389] as const,
    goodsX: 450,
    goodsY: 389,
    goodsW: 110,
  },

  charges: {
    prepaidWeight: [73, 175, 148] as const,
    collectWeight: [180, 282, 148] as const,

    prepaidValuation: [73, 175, 125] as const,
    collectValuation: [180, 282, 125] as const,

    prepaidTax: [73, 175, 102] as const,
    collectTax: [180, 282, 102] as const,

    prepaidAgent: [73, 175, 79] as const,
    collectAgent: [180, 282, 79] as const,

    prepaidCarrier: [73, 175, 56] as const,
    collectCarrier: [180, 282, 56] as const,

    totalPrepaid: [73, 175, 33] as const,
    totalCollect: [180, 282, 33] as const,
  },

  execution: {
    date: [327, 410, 38] as const,
    place: [410, 470, 38] as const,
    agent: [470, 565, 38] as const,
  },
};

export async function generateAirWaybill(
  shipment: any,
) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "air-waybill-template.pdf",
  );

  const allianceLogoPath = path.join(
    process.cwd(),
    "public",
    "logo",
    "alliance-air-logo.jpeg",
  );

  const logicartsLogoPath = path.join(
    process.cwd(),
    "public",
    "logo",
    "logicarts-logo.png",
  );

  const templateBytes =
    await fs.readFile(templatePath);

  const pdf =
    await PDFDocument.load(templateBytes);

  const pages = pdf.getPages();

  if (pages.length !== 2) {
    throw new Error(
      `Expected Alliance Air AWB template to contain 2 pages; found ${pages.length}.`,
    );
  }

  /*
   * Only page 1 gets shipment data.
   * Page 2 remains completely untouched.
   */
  const page = pages[0];

  const font =
    await pdf.embedFont(
      StandardFonts.Helvetica,
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold,
    );

  /*
   * ------------------------------------------------
   * SHIPMENT VALUES
   * ------------------------------------------------
   */

  const trackingNumber =
    clean(shipment.trackingNumber);

  /*
   * Use IATA airline designator first.
   * Example: Alliance Air = 9I.
   *
   * Only fall back to iataPrefix when no
   * designator exists.
   */
  const airlineCode =
    clean(
      shipment.airline?.iataDesignator,
    ) ||
    clean(
      shipment.airline?.iataPrefix,
    );

  const airlineName =
    clean(shipment.airline?.name) ||
    "Alliance Air";

  const origin =
    clean(shipment.origin);

  const destination =
    clean(shipment.destination);

  const customerCode =
    clean(shipment.customer?.code);

  const flightNumber =
    clean(shipment.flightNumber);

  const bookingDate =
    formatDate(shipment.bookingDate);

  const flightDate =
    formatDate(
      shipment.scheduledDeparture ||
        shipment.bookingDate,
    );

  const departureTime =
    formatTime(
      shipment.scheduledDeparture,
    );

  const arrivalTime =
    formatTime(
      shipment.scheduledArrival,
    );

  const freight =
    Number(shipment.freight || 0);

  const gst =
    Number(shipment.gst || 0);

  const total =
    Number(shipment.total || 0);

  const actualWeight =
    Number(
      shipment.actualWeight || 0,
    );

  const chargeableWeight =
    Number(
      shipment.chargeableWeight || 0,
    );

  const rate =
    chargeableWeight > 0
      ? freight / chargeableWeight
      : 0;

  const packages =
    Array.isArray(shipment.packages)
      ? shipment.packages
      : [];

  /*
   * ------------------------------------------------
   * HEADER
   * ------------------------------------------------
   */

  drawCell(
    page,
    bold,
    `${airlineCode} | ${origin}`,
    ...F.header.left,
    8,
    "left",
  );

  drawCell(
    page,
    font,
    `Printed: ${bookingDate}`,
    ...F.header.date,
    6,
    "center",
  );

  drawCell(
    page,
    bold,
    trackingNumber,
    ...F.header.awb,
    8,
    "right",
  );

  /*
   * ------------------------------------------------
   * SHIPPER
   * ------------------------------------------------
   */

  drawCell(
    page,
    bold,
    shipment.senderName,
    ...F.shipper.name,
    7,
  );

  drawWrapped(
    page,
    font,
    shipment.senderAddress,
    F.shipper.addressX,
    F.shipper.addressY,
    F.shipper.addressW,
    7,
    9,
    3,
  );

  drawCell(
    page,
    font,
    [shipment.senderCity, shipment.senderState]
      .filter(Boolean)
      .join(", "),
    ...F.shipper.city,
    7,
  );

  drawCell(
    page,
    font,
    shipment.senderPincode
      ? `PIN: ${shipment.senderPincode}`
      : "",
    ...F.shipper.pin,
    7,
  );

  drawCell(
    page,
    font,
    shipment.senderGSTIN
      ? `GSTIN: ${shipment.senderGSTIN}`
      : "",
    ...F.shipper.gst,
    7,
  );

  drawCell(
    page,
    font,
    shipment.senderPhone
      ? `Mob: ${shipment.senderPhone}`
      : "",
    ...F.shipper.phone,
    7,
  );

  /*
   * ------------------------------------------------
   * CONSIGNEE
   * ------------------------------------------------
   */

  drawCell(
    page,
    bold,
    shipment.receiverName,
    ...F.consignee.name,
    7,
  );

  drawWrapped(
    page,
    font,
    shipment.receiverAddress,
    F.consignee.addressX,
    F.consignee.addressY,
    F.consignee.addressW,
    7,
    9,
    3,
  );

  drawCell(
    page,
    font,
    [
      shipment.receiverCity,
      shipment.receiverState,
    ]
      .filter(Boolean)
      .join(", "),
    ...F.consignee.city,
    7,
  );

  drawCell(
    page,
    font,
    shipment.receiverPincode
      ? `PIN: ${shipment.receiverPincode}`
      : "",
    ...F.consignee.pin,
    7,
  );

  drawCell(
    page,
    font,
    shipment.receiverGSTIN
      ? `GSTIN: ${shipment.receiverGSTIN}`
      : "",
    ...F.consignee.gst,
    7,
  );

  drawCell(
    page,
    font,
    shipment.receiverPhone
      ? `Mob: ${shipment.receiverPhone}`
      : "",
    ...F.consignee.phone,
    7,
  );

  /*
   * ------------------------------------------------
   * ALLIANCE AIR + LOGICARTS BRANDING
   * ------------------------------------------------
   *
   * Both logos remain inside the carrier section.
   * Logicarts sits directly below Alliance Air and
   * does not touch the horizontal form borders.
   */

  try {
    const allianceBytes =
      await fs.readFile(
        allianceLogoPath,
      );

    const allianceLogo =
      await pdf.embedJpg(
        allianceBytes,
      );

    page.drawImage(
      allianceLogo,
      {
        x: 397,
        y: 746,
        width: 150,
        height: 38,
      },
    );
  } catch (error) {
    console.warn(
      "Unable to embed Alliance Air logo:",
      error,
    );
  }

  try {
    const logicartsBytes =
      await fs.readFile(
        logicartsLogoPath,
      );

    const logicartsLogo =
      await pdf.embedPng(
        logicartsBytes,
      );

    page.drawImage(
      logicartsLogo,
      {
        x: 425,
        y: 710,
        width: 95,
        height: 25,
      },
    );
  } catch (error) {
    console.warn(
      "Unable to embed Logicarts logo:",
      error,
    );
  }

  drawCell(
    page,
    bold,
    "Logicarts",
    ...F.agent.name,
    7,
  );

  drawCell(
    page,
    font,
    origin
      ? `Booking Agent - ${origin}`
      : "Booking Agent",
    ...F.agent.city,
    6,
  );

  /*
   * Do NOT put "Alliance Air Aviation Limited"
   * inside the agent/accounting cells.
   *
   * Alliance Air carrier branding/name already
   * exists in the supplied carrier template.
   */

  drawCell(
    page,
    bold,
    airlineCode,
    ...F.agent.code,
    7,
    "center",
  );

  drawCell(
    page,
    bold,
    customerCode,
    ...F.agent.reference,
    7,
    "center",
  );

  /*
   * ------------------------------------------------
   * ROUTING
   * ------------------------------------------------
   */

  drawCell(
    page,
    bold,
    origin,
    ...F.route.origin,
    8,
    "center",
  );

  drawCell(
    page,
    font,
    `${airlineCode} ${airlineName}`,
    ...F.route.carrier,
    6,
    "center",
  );

  /*
   * Destination belongs in the Airport of
   * Destination row, NOT the routing "To" box.
   */
  drawCell(
    page,
    bold,
    destination,
    ...F.route.destination,
    8,
    "center",
  );

  drawCell(
    page,
    bold,
    flightNumber,
    ...F.route.flight,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    flightDate,
    ...F.route.date,
    7,
    "center",
  );

  /*
   * IMPORTANT:
   *
   * Do NOT redraw:
   *
   * Currency labels
   * PPD/COLL labels
   * Declared Value labels
   * Insurance labels
   * NVD / NCV
   *
   * Those form elements remain controlled by
   * the Alliance template / carrier process.
   */

  /*
   * ------------------------------------------------
   * HANDLING
   * ------------------------------------------------
   */

  const handling = [
    clean(shipment.contents),

    departureTime
      ? `STD ${departureTime}`
      : "",

    arrivalTime
      ? `STA ${arrivalTime}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  drawWrapped(
    page,
    font,
    handling,
    F.handling.x,
    F.handling.y,
    F.handling.width,
    7,
    9,
    2,
  );

  /*
   * ------------------------------------------------
   * CARGO TABLE
   * ------------------------------------------------
   */

  drawCell(
    page,
    font,
    shipment.packageCount,
    ...F.cargo.pieces,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    actualWeight
      ? amount(actualWeight)
      : "",
    ...F.cargo.gross,
    7,
    "center",
  );

  /*
   * K = kilograms in this template.
   */
  drawCell(
    page,
    font,
    actualWeight
      ? "K"
      : "",
    ...F.cargo.kg,
    6,
    "center",
  );

  /*
   * Rate Class / Commodity:
   *
   * Do NOT invent Q / GEN unless these become
   * real shipment fields in the application.
   *
   * Therefore left blank for now.
   */

  drawCell(
    page,
    font,
    chargeableWeight
      ? amount(chargeableWeight)
      : "",
    ...F.cargo.chargeable,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    rate > 0
      ? amount(rate)
      : "",
    ...F.cargo.rate,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    freight > 0
      ? amount(freight)
      : "",
    ...F.cargo.charge,
    7,
    "center",
  );

  /*
   * Cargo table total here is freight/weight
   * charge only. GST is shown below.
   */
  drawCell(
    page,
    bold,
    freight > 0
      ? amount(freight)
      : "",
    ...F.cargo.total,
    7,
    "center",
  );

  drawWrapped(
    page,
    font,
    shipment.contents,
    F.cargo.goodsX,
    F.cargo.goodsY,
    F.cargo.goodsW,
    6,
    8,
    2,
  );

  let dimensionY = 362;

  for (
    const pkg of packages.slice(0, 6)
  ) {
    const l = clean(pkg.length);
    const w = clean(pkg.width);
    const h = clean(pkg.height);

    if (!l && !w && !h) {
      continue;
    }

    drawCell(
      page,
      font,
      `${l} x ${w} x ${h} cm`,
      450,
      560,
      dimensionY,
      5.5,
      "left",
    );

    dimensionY -= 9;
  }

  /*
   * ------------------------------------------------
   * PREPAID ACCOUNTING
   * ------------------------------------------------
   *
   * Logicarts shipment workflow is prepaid.
   */

  drawCell(
    page,
    font,
    amount(freight),
    ...F.charges.prepaidWeight,
    7,
    "center",
  );

  /*
   * Collect values are zero.
   * Keep them numeric, not "INR 0.00",
   * because the currency is defined elsewhere
   * in the AWB form.
   */
  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.collectWeight,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.prepaidValuation,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.collectValuation,
    7,
    "center",
  );

  drawCell(
    page,
    bold,
    amount(gst),
    ...F.charges.prepaidTax,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.collectTax,
    7,
    "center",
  );

  /*
   * Agent / carrier charge fields remain zero
   * until real charge components exist.
   */
  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.prepaidAgent,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.collectAgent,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.prepaidCarrier,
    7,
    "center",
  );

  drawCell(
    page,
    font,
    "0.00",
    ...F.charges.collectCarrier,
    7,
    "center",
  );

  drawCell(
    page,
    bold,
    amount(total),
    ...F.charges.totalPrepaid,
    8,
    "center",
  );

  drawCell(
    page,
    bold,
    "0.00",
    ...F.charges.totalCollect,
    8,
    "center",
  );

  /*
   * ------------------------------------------------
   * EXECUTION
   * ------------------------------------------------
   */

  drawCell(
    page,
    font,
    bookingDate,
    ...F.execution.date,
    6,
    "center",
  );

  drawCell(
    page,
    font,
    origin,
    ...F.execution.place,
    6,
    "center",
  );

  drawCell(
    page,
    bold,
    "Logicarts",
    ...F.execution.agent,
    6,
    "center",
  );

  /*
   * Page 2 deliberately untouched.
   */

  return pdf.save();
}
