import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import fs from "node:fs/promises";
import path from "node:path";

const W = 595.28;
const H = 841.89;

function clean(value: unknown): string {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/→/g, "->")
    .replace(/×/g, "x");
}

function money(value: unknown): string {
  return Number(value || 0).toFixed(2);
}

function formatDate(value: unknown): string {
  if (!value) return "";

  const d = new Date(String(value));

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-GB", {
    timeZone: "Asia/Kolkata",
  });
}

function formatTime(value: unknown): string {
  if (!value) return "";

  const d = new Date(String(value));

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function box(
  page: any,
  x: number,
  y: number,
  width: number,
  height: number,
  thickness = 0.55,
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderWidth: thickness,
    borderColor: rgb(0, 0, 0),
  });
}

function line(
  page: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness = 0.55,
) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness,
    color: rgb(0, 0, 0),
  });
}

function fitSize(
  font: any,
  value: string,
  maxWidth: number,
  preferred = 7,
  min = 4.3,
) {
  let size = preferred;

  while (
    size > min &&
    font.widthOfTextAtSize(value, size) > maxWidth
  ) {
    size -= 0.25;
  }

  return size;
}


type SafeTextField = {
  x: number;
  y: number;
  width: number;
  height: number;

  fontSize: number;
  minFontSize: number;

  align?: "left" | "center" | "right";

  maxLines?: number;
  lineHeight?: number;

  paddingX?: number;
  paddingY?: number;
};

function wrapText(
  font: any,
  text: string,
  size: number,
  width: number,
) {
  const words =
    text.split(/\s+/).filter(Boolean);

  const lines: string[] = [];

  let current = "";

  for (const word of words) {
    const candidate =
      current
        ? `${current} ${word}`
        : word;

    if (
      current &&
      font.widthOfTextAtSize(
        candidate,
        size,
      ) > width
    ) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function drawFittedText(
  page: any,
  font: any,
  value: unknown,
  field: SafeTextField,
) {
  const text = clean(value);

  if (!text) return;

  const paddingX =
    field.paddingX ?? 3;

  const paddingY =
    field.paddingY ?? 2;

  const usableWidth =
    Math.max(
      1,
      field.width -
        paddingX * 2,
    );

  const usableHeight =
    Math.max(
      1,
      field.height -
        paddingY * 2,
    );

  const maxLines =
    Math.max(
      1,
      field.maxLines ?? 1,
    );

  let size =
    field.fontSize;

  let lines: string[] = [];

  while (
    size >= field.minFontSize
  ) {
    if (maxLines === 1) {
      lines = [text];
    } else {
      lines =
        wrapText(
          font,
          text,
          size,
          usableWidth,
        );
    }

    const lineHeight =
      field.lineHeight ??
      size * 1.18;

    const textHeight =
      lines.length *
      lineHeight;

    const widest =
      Math.max(
        ...lines.map(
          (line) =>
            font.widthOfTextAtSize(
              line,
              size,
            ),
        ),
      );

    if (
      lines.length <= maxLines &&
      widest <= usableWidth &&
      textHeight <= usableHeight
    ) {
      break;
    }

    size -= 0.2;
  }

  size =
    Math.max(
      size,
      field.minFontSize,
    );

  if (maxLines === 1) {
    /*
     * Last-resort clipping by characters.
     * Nothing is ever allowed outside the cell.
     */
    let fitted = text;

    while (
      fitted.length > 1 &&
      font.widthOfTextAtSize(
        fitted,
        size,
      ) > usableWidth
    ) {
      fitted =
        fitted.slice(0, -1);
    }

    lines = [fitted];
  } else {
    lines =
      wrapText(
        font,
        text,
        size,
        usableWidth,
      ).slice(0, maxLines);
  }

  const lineHeight =
    field.lineHeight ??
    size * 1.18;

  let y =
    field.y +
    field.height -
    paddingY -
    size;

  for (const line of lines) {
    const textWidth =
      font.widthOfTextAtSize(
        line,
        size,
      );

    let x =
      field.x + paddingX;

    if (
      field.align === "center"
    ) {
      x =
        field.x +
        (field.width -
          textWidth) /
          2;
    } else if (
      field.align === "right"
    ) {
      x =
        field.x +
        field.width -
        paddingX -
        textWidth;
    }

    /*
     * Clamp X so text can never start
     * outside the field.
     */
    x =
      Math.max(
        field.x + paddingX,
        Math.min(
          x,
          field.x +
            field.width -
            paddingX -
            textWidth,
        ),
      );

    page.drawText(
      line,
      {
        x,
        y,
        size,
        font,
        color: rgb(
          0,
          0,
          0,
        ),
        maxWidth:
          usableWidth,
      },
    );

    y -= lineHeight;

    if (
      y <
      field.y + paddingY
    ) {
      break;
    }
  }
}

function draw(
  page: any,
  font: any,
  value: unknown,
  x: number,
  y: number,
  maxWidth = 500,
  size = 7,
) {
  const content = clean(value);

  if (!content) return;

  const actualSize =
    fitSize(font, content, maxWidth, size);

  page.drawText(content, {
    x,
    y,
    size: actualSize,
    font,
    color: rgb(0, 0, 0),
  });
}

function center(
  page: any,
  font: any,
  value: unknown,
  left: number,
  right: number,
  y: number,
  size = 7,
) {
  const content = clean(value);

  if (!content) return;

  const maxWidth =
    right - left - 6;

  const actualSize =
    fitSize(
      font,
      content,
      maxWidth,
      size,
    );

  const width =
    font.widthOfTextAtSize(
      content,
      actualSize,
    );

  page.drawText(content, {
    x:
      left +
      (right - left - width) / 2,
    y,
    size: actualSize,
    font,
    color: rgb(0, 0, 0),
  });
}

function wrapped(
  page: any,
  font: any,
  value: unknown,
  x: number,
  y: number,
  width: number,
  size = 6.2,
  lineHeight = 7.5,
  maxLines = 6,
) {
  const content = clean(value);

  if (!content) return;

  const words =
    content.split(/\s+/).filter(Boolean);

  let current = "";
  let currentY = y;
  let used = 0;

  for (const word of words) {
    const candidate =
      current
        ? `${current} ${word}`
        : word;

    if (
      current &&
      font.widthOfTextAtSize(candidate, size) >
        width
    ) {
      draw(
        page,
        font,
        current,
        x,
        currentY,
        width,
        size,
      );

      currentY -= lineHeight;
      used++;

      if (used >= maxLines) return;

      current = word;
    } else {
      current = candidate;
    }
  }

  if (current && used < maxLines) {
    draw(
      page,
      font,
      current,
      x,
      currentY,
      width,
      size,
    );
  }
}

function label(
  page: any,
  font: any,
  value: string,
  x: number,
  y: number,
) {
  draw(
    page,
    font,
    value,
    x,
    y,
    250,
    5.2,
  );
}

async function exists(
  file: string,
) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

export async function generateCompleteAirWaybill(
  shipment: any,
) {
  const pdf =
    await PDFDocument.create();

  const page =
    pdf.addPage([W, H]);

  const font =
    await pdf.embedFont(
      StandardFonts.Helvetica,
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold,
    );

  const allianceLogoPath =
    path.join(
      process.cwd(),
      "public",
      "logo",
      "alliance-air-logo.png",
    );

  const logicartsLogoPath =
    path.join(
      process.cwd(),
      "public",
      "logo",
      "logicarts-logo.png",
    );

  const airlineCode =
    clean(
      shipment.airline?.iataDesignator,
    ) ||
    clean(
      shipment.airline?.iataPrefix,
    ) ||
    "9I";

  const airlineName =
    clean(shipment.airline?.name) ||
    "Alliance Air";

  const awb =
    clean(shipment.trackingNumber);

  const origin =
    clean(shipment.origin);

  const destination =
    clean(shipment.destination);

  const flight =
    clean(shipment.flightNumber);

  const customerCode =
    clean(shipment.customer?.code);

  const shipperAccount =
    clean(shipment.shipperAccountNumber) ||
    customerCode;

  const consigneeAccount =
    clean(shipment.consigneeAccountNumber) ||
    customerCode;

  const agentIataCode =
    clean(shipment.agentIataCode) ||
    clean(shipment.agent?.code);

  const rateClass =
    clean(shipment.rateClass);

  const commodityItemNumber =
    clean(shipment.commodityItemNumber);

  const specialCargoIndicator =
    clean(shipment.specialCargoIndicator);

  const issuingAgentName =
    clean(shipment.agent?.companyName) ||
    "Logicarts";

  const issuingAgentCity =
    clean(shipment.agent?.city) ||
    origin;

  const bookingDate =
    formatDate(shipment.bookingDate);

  const flightDate =
    formatDate(
      shipment.scheduledDeparture ||
      shipment.bookingDate,
    );

  const std =
    formatTime(
      shipment.scheduledDeparture,
    );

  const sta =
    formatTime(
      shipment.scheduledArrival,
    );

  const aircraftType =
    clean(shipment.aircraftType);

  const arrivalTerminal =
    clean(shipment.arrivalTerminal);

  const freight =
    Number(shipment.freight || 0);

  const gst =
    Number(shipment.gst || 0);

  const total =
    Number(shipment.total || 0);

  const actualWeight =
    Number(shipment.actualWeight || 0);

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
   * HEADER
   */

  draw(
    page,
    bold,
    `${airlineCode} | ${origin} | ${awb.replace(/^.*?-/, "")}`,
    18,
    820,
    170,
    8,
  );

  center(
    page,
    bold,
    "AIR WAYBILL",
    200,
    395,
    818,
    12,
  );

  center(
    page,
    font,
    "(Air Consignment Note)",
    200,
    395,
    807,
    6,
  );

  center(
    page,
    bold,
    awb,
    455,
    575,
    820,
    8,
  );

  /*
   * TOP AREA
   */

  const x0 = 18;
  const x1 = 300;
  const xEnd = 577;

  const top = 795;
  const mid = 690;
  const bottom = 575;

  box(
    page,
    x0,
    bottom,
    xEnd - x0,
    top - bottom,
  );

  line(
    page,
    x1,
    bottom,
    x1,
    top,
  );

  line(
    page,
    x0,
    mid,
    xEnd,
    mid,
  );

  /*
   * SHIPPER
   */

  label(
    page,
    font,
    "Shipper's Name and Address",
    24,
    785,
  );

  draw(
    page,
    bold,
    shipment.senderName,
    30,
    768,
    245,
    8,
  );

  wrapped(
    page,
    font,
    shipment.senderAddress,
    30,
    753,
    245,
    6.5,
    8,
    3,
  );

  draw(
    page,
    font,
    [
      shipment.senderCity,
      shipment.senderState,
    ]
      .filter(Boolean)
      .join(", "),
    30,
    718,
    245,
    6.5,
  );

  draw(
    page,
    font,
    shipment.senderPincode
      ? `PIN: ${shipment.senderPincode}`
      : "",
    30,
    707,
    120,
    6.5,
  );

  draw(
    page,
    font,
    shipment.senderGSTIN
      ? `GSTIN: ${shipment.senderGSTIN}`
      : "",
    145,
    707,
    135,
    6.5,
  );

  draw(
    page,
    font,
    shipment.senderPhone
      ? `Mob: ${shipment.senderPhone}`
      : "",
    30,
    696,
    245,
    6.5,
  );

  /*
   * SHIPPER ACCOUNT SUB-BOX
   */

  box(
    page,
    165,
    760,
    135,
    35,
  );

  center(
    page,
    font,
    "Shipper's Account Number",
    165,
    300,
    785,
    5,
  );

  center(
    page,
    bold,
    shipperAccount,
    165,
    300,
    768,
    7,
  );

  /*
   * CONSIGNEE
   */

  label(
    page,
    font,
    "Consignee's Name and Address",
    24,
    680,
  );

  draw(
    page,
    bold,
    shipment.receiverName,
    30,
    662,
    245,
    8,
  );

  wrapped(
    page,
    font,
    shipment.receiverAddress,
    30,
    647,
    245,
    6.5,
    8,
    3,
  );

  draw(
    page,
    font,
    [
      shipment.receiverCity,
      shipment.receiverState,
    ]
      .filter(Boolean)
      .join(", "),
    30,
    610,
    245,
    6.5,
  );

  draw(
    page,
    font,
    shipment.receiverPincode
      ? `PIN: ${shipment.receiverPincode}`
      : "",
    30,
    599,
    120,
    6.5,
  );

  draw(
    page,
    font,
    shipment.receiverGSTIN
      ? `GSTIN: ${shipment.receiverGSTIN}`
      : "",
    145,
    599,
    135,
    6.5,
  );

  draw(
    page,
    font,
    shipment.receiverPhone
      ? `Mob: ${shipment.receiverPhone}`
      : "",
    30,
    588,
    245,
    6.5,
  );

  box(
    page,
    165,
    655,
    135,
    35,
  );

  center(
    page,
    font,
    "Consignee's Account Number",
    165,
    300,
    680,
    5,
  );

  center(
    page,
    bold,
    consigneeAccount,
    165,
    300,
    663,
    7,
  );

  /*
   * CARRIER HEADER
   */

  label(
    page,
    font,
    "Not negotiable",
    307,
    785,
  );

  /*
   * Carrier branding area.
   *
   * Keep Alliance Air and Logicarts inside the
   * same carrier header box and away from borders.
   */
  if (await exists(allianceLogoPath)) {
    const allianceBytes =
      await fs.readFile(allianceLogoPath);

    const allianceLogo =
      await pdf.embedPng(allianceBytes);

    page.drawImage(allianceLogo, {
      x: 375,
      y: 742,
      width: 170,
      height: 46,
    });
  } else {
    center(
      page,
      bold,
      "ALLIANCE AIR",
      335,
      555,
      750,
      13,
    );
  }

  center(
    page,
    font,
    "issued by",
    340,
    550,
    716,
    5.5,
  );

  if (await exists(logicartsLogoPath)) {
    const logicartsBytes =
      await fs.readFile(logicartsLogoPath);

    const logicartsLogo =
      await pdf.embedPng(logicartsBytes);

    page.drawImage(logicartsLogo, {
      x: 402,
      y: 700,
      width: 92,
      height: 24,
    });
  }

  line(
    page,
    x1,
    677,
    xEnd,
    677,
  );

  draw(
    page,
    font,
    "Copies 1,2 and 3 of this Air Waybill are originals and have the same validity",
    306,
    668,
    265,
    5.2,
  );

  line(
    page,
    x1,
    660,
    xEnd,
    660,
  );

  wrapped(
    page,
    font,
    "It is agreed that the goods described herein are accepted in apparent good order and condition for carriage subject to the conditions of contract. The use and carriage of this shipment is subject to the conditions of contract on the reverse hereof. All goods may be carried by any other means including road or any other carrier unless specific contrary instructions are given by the shipper. The shipper agrees that the shipment may be carried via intermediate stopping places which the carrier deems appropriate. The shipper's attention is drawn to the notice concerning carrier's limitation of liability.",
    306,
    650,
    265,
    5.1,
    6.2,
    12,
  );

  /*
   * AGENT / ACCOUNTING ROW
   */

  const agentTop = 570;
  const agentBottom = 533;

  box(
    page,
    x0,
    agentBottom,
    xEnd - x0,
    agentTop - agentBottom,
  );

  line(
    page,
    165,
    agentBottom,
    165,
    agentTop,
  );

  line(
    page,
    245,
    agentBottom,
    245,
    agentTop,
  );

  line(
    page,
    325,
    agentBottom,
    325,
    agentTop,
  );

  label(
    page,
    font,
    "Issuing Carrier's Agent Name and City",
    23,
    562,
  );

  draw(
    page,
    bold,
    issuingAgentName,
    28,
    544,
    95,
    7,
  );

  draw(
    page,
    bold,
    issuingAgentCity,
    120,
    544,
    40,
    7,
  );

  label(
    page,
    font,
    "Agent's IATA Code",
    170,
    562,
  );

  center(
    page,
    bold,
    agentIataCode,
    165,
    245,
    544,
    7,
  );

  label(
    page,
    font,
    "Account No.",
    250,
    562,
  );

  center(
    page,
    bold,
    shipperAccount,
    245,
    325,
    544,
    7,
  );

  label(
    page,
    font,
    "Accounting Information",
    331,
    562,
  );

  draw(
    page,
    bold,
    "PREPAID",
    335,
    544,
    110,
    7,
  );

  /*
   * DEPARTURE / REFERENCE
   */

  const infoTop = 529;
  const infoBottom = 500;

  box(
    page,
    x0,
    infoBottom,
    xEnd - x0,
    infoTop - infoBottom,
  );

  line(
    page,
    285,
    infoBottom,
    285,
    infoTop,
  );

  line(
    page,
    395,
    infoBottom,
    395,
    infoTop,
  );

  label(
    page,
    font,
    "Airport of Departure (Addr. of First Carrier) and Requested Routing",
    23,
    520,
  );

  draw(
    page,
    font,
    `Booking Agent - ${origin}`,
    28,
    506,
    245,
    6,
  );

  label(
    page,
    font,
    "Reference Number",
    291,
    520,
  );

  center(
    page,
    bold,
    customerCode,
    285,
    395,
    506,
    7,
  );

  label(
    page,
    font,
    "Optional Shipping Information",
    402,
    520,
  );

  center(
    page,
    bold,
    "NIL",
    395,
    577,
    506,
    6.5,
  );

  /*
   * ROUTING GRID
   */

  const routeTop = 496;
  const routeBottom = 450;

  box(
    page,
    x0,
    routeBottom,
    xEnd - x0,
    routeTop - routeBottom,
  );

  const routeCols = [
    18,
    60,
    135,
    205,
    240,
    275,
    310,
    345,
    382,
    420,
    455,
    495,
    577,
  ];

  for (
    let i = 1;
    i < routeCols.length - 1;
    i++
  ) {
    line(
      page,
      routeCols[i],
      routeBottom,
      routeCols[i],
      routeTop,
    );
  }

  label(page, font, "To", 24, 487);
  label(page, font, "By First Carrier", 66, 487);
  label(page, font, "Routing and Destination", 143, 487);
  label(page, font, "To", 211, 487);
  label(page, font, "By", 246, 487);
  label(page, font, "To", 281, 487);
  label(page, font, "By", 316, 487);
  label(page, font, "Currency", 350, 487);
  label(page, font, "CHGS Code", 387, 487);
  label(page, font, "WT/VAL", 425, 487);
  label(page, font, "Other", 460, 487);
  label(page, font, "Declared Value", 505, 487);

  center(
    page,
    bold,
    origin,
    18,
    60,
    461,
    8,
  );

  center(
    page,
    bold,
    `${airlineCode} ${airlineName}`,
    60,
    135,
    461,
    6,
  );

  center(
    page,
    bold,
    destination,
    135,
    205,
    461,
    7,
  );

  center(
    page,
    font,
    "NVD",
    205,
    240,
    461,
    7,
  );

  center(
    page,
    font,
    "NCV",
    240,
    275,
    461,
    7,
  );

  center(
    page,
    font,
    "PX",
    275,
    310,
    461,
    7,
  );

  center(
    page,
    bold,
    airlineCode,
    310,
    345,
    461,
    7,
  );

  center(
    page,
    bold,
    "INR",
    345,
    382,
    461,
    7,
  );

  center(
    page,
    bold,
    "PPD",
    420,
    455,
    461,
    6,
  );

  center(
    page,
    bold,
    "PPD",
    455,
    495,
    461,
    6,
  );

  /*
   * FLIGHT / INSURANCE
   */

  const flightTopY = 446;
  const flightBottomY = 414;

  box(
    page,
    x0,
    flightBottomY,
    xEnd - x0,
    flightTopY - flightBottomY,
  );

  const flightCols = [
    18,
    160,
    235,
    315,
    430,
    577,
  ];

  for (
    let i = 1;
    i < flightCols.length - 1;
    i++
  ) {
    line(
      page,
      flightCols[i],
      flightBottomY,
      flightCols[i],
      flightTopY,
    );
  }

  label(
    page,
    font,
    "Airport of Destination",
    24,
    437,
  );

  label(
    page,
    font,
    "Flight No.",
    166,
    437,
  );

  label(
    page,
    font,
    "Flight Date",
    241,
    437,
  );

  label(
    page,
    font,
    "For Carrier Use Only",
    321,
    437,
  );

  label(
    page,
    font,
    "Amount of Insurance",
    436,
    437,
  );

  center(
    page,
    bold,
    destination,
    18,
    160,
    420,
    8,
  );

  center(
    page,
    bold,
    flight || "",
    160,
    235,
    420,
    7,
  );

  center(
    page,
    bold,
    flightDate,
    235,
    315,
    420,
    7,
  );

  draw(
    page,
    font,
    [
      aircraftType,
      arrivalTerminal
        ? `Terminal ${arrivalTerminal}`
        : "",
    ]
      .filter(Boolean)
      .join(" | "),
    322,
    420,
    100,
    6,
  );

  center(
    page,
    bold,
    shipment.insuranceAmount != null
      ? money(shipment.insuranceAmount)
      : "0.00",
    430,
    577,
    420,
    7,
  );

  /*
   * HANDLING / SCI
   */

  const handlingTop = 410;
  const handlingBottom = 380;

  box(
    page,
    x0,
    handlingBottom,
    xEnd - x0,
    handlingTop - handlingBottom,
  );

  line(
    page,
    450,
    handlingBottom,
    450,
    handlingTop,
  );

  label(
    page,
    font,
    "Handling information",
    24,
    401,
  );

  const handling = [
    shipment.contents,
    std
      ? `STD: ${std}`
      : "",
    sta
      ? `STA: ${sta}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  draw(
    page,
    font,
    handling,
    28,
    387,
    410,
    6.5,
  );

  label(
    page,
    font,
    "SCI",
    505,
    401,
  );

  center(
    page,
    bold,
    specialCargoIndicator || "NIL",
    450,
    577,
    387,
    6.5,
  );

  /*
   * CARGO TABLE
   */

  const cargoTop = 376;
  const cargoBottom = 210;

  box(
    page,
    x0,
    cargoBottom,
    xEnd - x0,
    cargoTop - cargoBottom,
  );

  const cargoCols = [
    18,
    62,
    118,
    142,
    205,
    265,
    320,
    375,
    435,
    577,
  ];

  for (
    let i = 1;
    i < cargoCols.length - 1;
    i++
  ) {
    line(
      page,
      cargoCols[i],
      cargoBottom,
      cargoCols[i],
      cargoTop,
    );
  }

  line(
    page,
    x0,
    342,
    xEnd,
    342,
  );

  center(page, font, "No. of Pieces", 18, 62, 359, 5);
  center(page, font, "Gross Weight", 62, 118, 359, 5);
  center(page, font, "kg/lb", 118, 142, 359, 5);
  center(page, font, "Rate Class / Commodity Item No.", 142, 205, 359, 4.7);
  center(page, font, "Chargeable Weight", 205, 265, 359, 5);
  center(page, font, "Rate", 265, 320, 359, 5);
  center(page, font, "Charge", 320, 375, 359, 5);
  center(page, font, "Total", 375, 435, 359, 5);
  center(page, font, "Nature and Quantity of Goods", 435, 577, 359, 5);

  center(
    page,
    bold,
    shipment.packageCount,
    18,
    62,
    329,
    7,
  );

  center(
    page,
    font,
    money(actualWeight),
    62,
    118,
    329,
    7,
  );

  center(
    page,
    font,
    "K",
    118,
    142,
    329,
    7,
  );

  const commodityLabel = [
    rateClass,
    commodityItemNumber,
  ]
    .filter(Boolean)
    .join(" / ");

  center(
    page,
    font,
    commodityLabel,
    142,
    205,
    329,
    7,
  );

  center(
    page,
    font,
    money(chargeableWeight),
    205,
    265,
    329,
    7,
  );

  center(
    page,
    font,
    rate > 0
      ? money(rate)
      : "",
    265,
    320,
    329,
    7,
  );

  center(
    page,
    bold,
    money(freight),
    320,
    375,
    329,
    7,
  );

  center(
    page,
    bold,
    money(freight),
    375,
    435,
    329,
    7,
  );

  draw(
    page,
    bold,
    shipment.contents,
    443,
    329,
    125,
    6.5,
  );

  let dimY = 305;

  for (
    const pkg of packages.slice(0, 8)
  ) {
    const l = clean(pkg.length);
    const w = clean(pkg.width);
    const h = clean(pkg.height);

    if (!l && !w && !h) continue;

    draw(
      page,
      font,
      `${l} x ${w} x ${h} cm`,
      443,
      dimY,
      125,
      5.8,
    );

    dimY -= 9;
  }

  /*
   * LOWER ACCOUNTING + CERTIFICATION
   */

  const lowerTop = 205;
  const lowerBottom = 38;

  box(
    page,
    x0,
    lowerBottom,
    xEnd - x0,
    lowerTop - lowerBottom,
  );

  const lowerSplit = 292;

  line(
    page,
    lowerSplit,
    lowerBottom,
    lowerSplit,
    lowerTop,
  );

  /*
   * LEFT CHARGE GRID
   */

  center(
    page,
    font,
    "Prepaid",
    18,
    100,
    195,
    5.5,
  );

  center(
    page,
    font,
    "Weight Charge",
    100,
    180,
    195,
    5.5,
  );

  center(
    page,
    font,
    "Collect",
    180,
    230,
    195,
    5.5,
  );

  center(
    page,
    font,
    "Other Charges",
    230,
    292,
    195,
    5.5,
  );

  line(
    page,
    18,
    188,
    292,
    188,
  );

  const rows = [
    ["Weight Charge", freight, 0],
    ["Valuation Charge", 0, 0],
    ["Tax / GST", gst, 0],
    ["Other Charges Due Agent", 0, 0],
    ["Other Charges Due Carrier", 0, 0],
  ];

  let y = 174;

  for (
    const [
      title,
      prepaid,
      collect,
    ] of rows
  ) {
    draw(
      page,
      font,
      title,
      28,
      y,
      125,
      5.8,
    );

    center(
      page,
      font,
      money(prepaid),
      130,
      195,
      y,
      6.5,
    );

    center(
      page,
      font,
      money(collect),
      195,
      250,
      y,
      6.5,
    );

    y -= 17;
  }

  line(
    page,
    18,
    88,
    292,
    88,
  );

  draw(
    page,
    bold,
    "Total Prepaid",
    28,
    76,
    100,
    6.5,
  );

  center(
    page,
    bold,
    money(total),
    125,
    190,
    76,
    7,
  );

  draw(
    page,
    bold,
    "Total Collect",
    195,
    76,
    70,
    6.5,
  );

  center(
    page,
    bold,
    "0.00",
    245,
    292,
    76,
    7,
  );

  line(
    page,
    18,
    63,
    292,
    63,
  );

  draw(
    page,
    font,
    "Currency Conversion Rates",
    28,
    52,
    115,
    5.5,
  );

  center(
    page,
    font,
    "NIL",
    130,
    175,
    52,
    6,
  );

  draw(
    page,
    font,
    "CC Charges in Dest. Currency",
    180,
    52,
    105,
    5.5,
  );

  center(
    page,
    font,
    "NIL",
    250,
    292,
    52,
    6,
  );

  /*
   * RIGHT CERTIFICATION
   */

  wrapped(
    page,
    font,
    "Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage according to the applicable Dangerous Goods Regulations.",
    305,
    180,
    255,
    5.8,
    7,
    7,
  );

  line(
    page,
    315,
    118,
    560,
    118,
    0.45,
  );

  center(
    page,
    font,
    "Signature of Shipper or his Agent",
    315,
    560,
    108,
    6,
  );

  draw(
    page,
    font,
    `Executed on: ${bookingDate}`,
    305,
    82,
    110,
    6,
  );

  draw(
    page,
    font,
    `at place: ${origin}`,
    425,
    82,
    80,
    6,
  );

  center(
    page,
    bold,
    issuingAgentName,
    400,
    560,
    60,
    7,
  );

  center(
    page,
    font,
    "Booking / Issuing Agent",
    400,
    560,
    48,
    5.8,
  );

  /*
   * FOOTER
   */

  center(
    page,
    bold,
    awb,
    455,
    577,
    18,
    7,
  );

  /*
   * PAGE 2
   */

  const templatePath =
    path.join(
      process.cwd(),
      "public",
      "templates",
      "air-waybill-template.pdf",
    );

  try {
    const bytes =
      await fs.readFile(templatePath);

    const source =
      await PDFDocument.load(bytes);

    if (source.getPageCount() >= 2) {
      const copied =
        await pdf.copyPages(
          source,
          [1],
        );

      pdf.addPage(copied[0]);
    }
  } catch (error) {
    console.warn(
      "Unable to copy Alliance conditions page:",
      error,
    );
  }

  return pdf.save();
}
