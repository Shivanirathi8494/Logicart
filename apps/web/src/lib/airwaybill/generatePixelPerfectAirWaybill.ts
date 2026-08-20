import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import fs from "node:fs/promises";
import path from "node:path";

import {
  FIELD_MAP,
  type AwbField,
} from "./fieldMap";

/*
 * ============================================================
 * Alliance Air Pixel-Perfect AWB Generator
 * ============================================================
 *
 * RULES:
 *
 * 1. The original Alliance Air PDF owns ALL static graphics.
 * 2. Do NOT redraw boxes, lines, labels or legal text.
 * 3. We draw ONLY shipment-specific dynamic values.
 * 4. Every value must stay inside its field bounding box.
 * 5. Page 2 is never modified.
 */

function clean(value: unknown): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/→/g, "->")
    .replace(/×/g, "x")
    .trim();
}

function tbd(
  value: unknown,
): string {
  const result =
    clean(value);

  return result || "TBD";
}

function money(value: unknown): string {
  const number =
    Number(value || 0);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}

function formatDate(
  value: unknown,
): string {
  if (!value) {
    return "";
  }

  const date =
    new Date(String(value));

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      timeZone: "Asia/Kolkata",
    },
  );
}

function formatTime(
  value: unknown,
): string {
  if (!value) {
    return "";
  }

  const date =
    new Date(String(value));

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  );
}

/*
 * Splits text while respecting PDF font width.
 */
function wrapText(
  font: PDFFont,
  text: string,
  size: number,
  maxWidth: number,
): string[] {
  /*
   * Respect explicit newlines first.
   *
   * pdf-lib WinAnsi fonts cannot measure or draw
   * a string containing \n directly, so every
   * physical line must be handled separately.
   */
  const paragraphs =
    text.split(/\r?\n/);

  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words =
      paragraph
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
      continue;
    }

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
        ) > maxWidth
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
  }

  return lines;
}

function drawField(
  page: PDFPage,
  font: PDFFont,
  value: unknown,
  field: AwbField,
) {
  const text =
    clean(value);

  if (!text) {
    return;
  }

  const paddingX =
    field.paddingX ?? 2.5;

  const paddingY =
    field.paddingY ?? 2;

  const availableWidth =
    Math.max(
      1,
      field.width -
        paddingX * 2,
    );

  const availableHeight =
    Math.max(
      1,
      field.height -
        paddingY,
    );

  const maxLines =
    Math.max(
      1,
      field.maxLines ?? 1,
    );

  let fontSize =
    field.fontSize;

  let lines: string[] = [];

  /*
   * Shrink text until both width
   * and height fit.
   */
  while (
    fontSize >
    field.minFontSize
  ) {
    lines =
      maxLines === 1
        ? [text]
        : wrapText(
            font,
            text,
            fontSize,
            availableWidth,
          );

    const lineHeight =
      field.lineHeight ??
      fontSize * 1.15;

    const heightNeeded =
      lines.length *
      lineHeight;

    const widest =
      Math.max(
        ...lines.map(
          (line) =>
            font.widthOfTextAtSize(
              line,
              fontSize,
            ),
        ),
      );

    if (
      lines.length <= maxLines &&
      widest <= availableWidth &&
      heightNeeded <=
        availableHeight
    ) {
      break;
    }

    fontSize -= 0.2;
  }

  fontSize =
    Math.max(
      fontSize,
      field.minFontSize,
    );

  /*
   * Single-line fields:
   * shorten only as a final safeguard.
   */
  if (maxLines === 1) {
    let fitted =
      text;

    while (
      fitted.length > 1 &&
      font.widthOfTextAtSize(
        fitted,
        fontSize,
      ) > availableWidth
    ) {
      fitted =
        fitted.slice(
          0,
          -1,
        );
    }

    lines = [fitted];
  } else {
    lines =
      wrapText(
        font,
        text,
        fontSize,
        availableWidth,
      ).slice(
        0,
        maxLines,
      );
  }

  const lineHeight =
    field.lineHeight ??
    fontSize * 1.15;

  /*
   * FIELD_MAP y coordinates represent the baseline of
   * the FIRST line of text.
   *
   * PDF coordinates grow upward from the bottom of the page.
   * Additional wrapped lines therefore move downward by
   * subtracting lineHeight.
   */
  let y =
    field.y;

  for (
    const line of lines
  ) {
    const width =
      font.widthOfTextAtSize(
        line,
        fontSize,
      );

    let x =
      field.x +
      paddingX;

    if (
      field.align === "center"
    ) {
      x =
        field.x +
        (
          field.width -
          width
        ) /
          2;
    }

    if (
      field.align === "right"
    ) {
      x =
        field.x +
        field.width -
        paddingX -
        width;
    }

    /*
     * Hard horizontal clamp.
     */
    const minX =
      field.x +
      paddingX;

    const maxX =
      field.x +
      field.width -
      paddingX -
      width;

    x =
      Math.max(
        minX,
        Math.min(
          x,
          Math.max(
            minX,
            maxX,
          ),
        ),
      );

    /*
     * Do not draw another line once
     * it would cross the field bottom.
     */
    /*
     * Never allow wrapped text to extend below its
     * allocated writable height.
     */
    const fieldBottom =
      field.y -
      field.height +
      paddingY;

    if (
      y <
      fieldBottom
    ) {
      break;
    }

    page.drawText(
      line,
      {
        x,
        y,
        size:
          fontSize,
        font,
        color:
          rgb(
            0,
            0,
            0,
          ),
        maxWidth:
          availableWidth,
      },
    );

    y -=
      lineHeight;
  }
}

export async function generatePixelPerfectAirWaybill(
  shipment: any,
) {
  const templatePath =
    path.join(
      process.cwd(),
      "public",
      "templates",
      "air-waybill-template.pdf",
    );

  const logicartsLogoPath =
    path.join(
      process.cwd(),
      "public",
      "logo",
      "logicarts-logo.png",
    );

  const templateBytes =
    await fs.readFile(
      templatePath,
    );

  const pdf =
    await PDFDocument.load(
      templateBytes,
    );

  const pages =
    pdf.getPages();

  const awbValue = {
    shipperName:
      tbd(shipment.senderName),

    shipperDetails:
      [
        clean(shipment.senderAddress),
        [
          clean(shipment.senderCity),
          clean(shipment.senderState),
        ]
          .filter(Boolean)
          .join(", "),
        [
          shipment.senderPincode
            ? `PIN: ${shipment.senderPincode}`
            : "",
          shipment.senderGSTIN
            ? `GSTIN: ${shipment.senderGSTIN}`
            : "",
        ]
          .filter(Boolean)
          .join("   "),
        shipment.senderPhone
          ? `Mob: ${shipment.senderPhone}`
          : "",
        shipment.shipperCountry
          ? clean(shipment.shipperCountry)
          : "",
      ]
        .filter(Boolean)
        .join("\n"),

    shipperAccount:
      tbd(
        shipment.shipperAccountNumber ||
        shipment.customer?.code,
      ),

    consigneeName:
      tbd(shipment.receiverName),

    consigneeDetails:
      [
        clean(shipment.receiverAddress),
        [
          clean(shipment.receiverCity),
          clean(shipment.receiverState),
        ]
          .filter(Boolean)
          .join(", "),
        [
          shipment.receiverPincode
            ? `PIN: ${shipment.receiverPincode}`
            : "",
          shipment.receiverGSTIN
            ? `GSTIN: ${shipment.receiverGSTIN}`
            : "",
        ]
          .filter(Boolean)
          .join("   "),
        shipment.receiverPhone
          ? `Mob: ${shipment.receiverPhone}`
          : "",
        shipment.receiverCountry
          ? clean(shipment.receiverCountry)
          : "",
      ]
        .filter(Boolean)
        .join("\n"),

    consigneeAccount:
      tbd(
        shipment.consigneeAccountNumber,
      ),

    airlineCode:
      tbd(
        shipment.airline?.iataDesignator,
      ),

    airlineName:
      tbd(
        shipment.airline?.name,
      ),

    carrierPan:
      tbd(
        shipment.airline?.panNumber,
      ),

    carrierGstin:
      tbd(
        shipment.airline?.gstNumber,
      ),

    agentName:
      tbd(
        shipment.agent?.companyName,
      ),

    agentCity:
      tbd(
        shipment.agent?.city,
      ),

    agentIata:
      tbd(
        shipment.agentIataCode,
      ),

    origin:
      tbd(shipment.origin),

    destination:
      tbd(shipment.destination),

    referenceNumber:
      tbd(
        shipment.paymentReference,
      ),

    accountingInformation:
      tbd(
        shipment.accountingInformation,
      ),

    currency:
      tbd(
        shipment.currency || "INR",
      ),

    chargesCode:
      tbd(
        shipment.chargesCode,
      ),

    wtVal:
      tbd(
        shipment.weightValuationPaymentType,
      ),

    other:
      tbd(
        shipment.otherChargesPaymentType,
      ),

    declaredCarriage:
      Number(
        shipment.declaredValueForCarriage || 0,
      ) > 0
        ? money(
            shipment.declaredValueForCarriage,
          )
        : "NVD",

    declaredCustoms:
      Number(
        shipment.declaredValueForCustoms || 0,
      ) > 0
        ? money(
            shipment.declaredValueForCustoms,
          )
        : "NCV",

    insurance:
      Number(
        shipment.insuranceAmount || 0,
      ) > 0
        ? money(
            shipment.insuranceAmount,
          )
        : "XXX",

    flightNumber:
      tbd(
        shipment.flightNumber,
      ),

    flightDate:
      tbd(
        formatDate(
          shipment.scheduledDeparture ||
          shipment.bookingDate,
        ),
      ),

    aircraft:
      tbd(
        shipment.aircraftType,
      ),

    carrierUse:
      [
        clean(shipment.aircraftType),
        shipment.arrivalTerminal
          ? `T${shipment.arrivalTerminal}`
          : "",
      ]
        .filter(Boolean)
        .join(" / ") || "TBD",

    handling:
      [
        shipment.handlingCode
          ? `SHC:${shipment.handlingCode}:${shipment.handlingDescription || ""}`
          : "",
        shipment.scheduledDeparture
          ? `STD ${formatTime(shipment.scheduledDeparture)}`
          : "",
        shipment.scheduledArrival
          ? `STA ${formatTime(shipment.scheduledArrival)}`
          : "",
        clean(shipment.remarks),
      ]
        .filter(Boolean)
        .join(" | "),

    sci:
      tbd(
        shipment.specialCargoIndicator,
      ),

    pieces:
      tbd(
        shipment.packageCount,
      ),

    grossWeight:
      money(
        shipment.actualWeight,
      ),

    chargeableWeight:
      money(
        shipment.chargeableWeight,
      ),

    rateClass:
      tbd(
        shipment.rateClass,
      ),

    commodity:
      tbd(
        shipment.commodityItemNumber,
      ),

    rate:
      Number(
        shipment.chargeableWeight || 0,
      ) > 0
        ? money(
            Number(shipment.freight || 0) /
            Number(shipment.chargeableWeight),
          )
        : "TBD",

    freight:
      money(
        shipment.freight,
      ),

    gst:
      money(
        shipment.gst,
      ),

    total:
      money(
        shipment.total,
      ),

    dimensions:
      Array.isArray(shipment.packages)
        ? shipment.packages
            .map((pkg: any) =>
              `${clean(pkg.length)} x ${clean(pkg.width)} x ${clean(pkg.height)} cm`
            )
            .filter(Boolean)
            .join(" | ")
        : "TBD",

    contents:
      tbd(
        shipment.contents,
      ),

    otherChargesDescription:
      tbd(
        shipment.otherChargesDescription,
      ),

    valuationCharge:
      money(
        shipment.valuationCharge || 0,
      ),

    otherDueAgent:
      money(
        shipment.otherChargesDueAgent || 0,
      ),

    otherDueCarrier:
      money(
        shipment.otherChargesDueCarrier || 0,
      ),

    totalPrepaid:
      money(
        shipment.totalPrepaid ??
        shipment.total ??
        0,
      ),

    totalCollect:
      money(
        shipment.totalCollect || 0,
      ),

    destinationCurrency:
      tbd(
        shipment.destinationCurrency ||
        shipment.currency ||
        "INR",
      ),

    currencyConversion:
      shipment.currencyConversionRate
        ? String(
            shipment.currencyConversionRate,
          )
        : "TBD",

    chargesAtDestination:
      money(
        shipment.chargesAtDestination || 0,
      ),

    totalCollectCharges:
      money(
        "0.00",
      ),

    carrierUseAtDestination:
      tbd(
        shipment.carrierUseAtDestination,
      ),

    executedOn:
      tbd(
        formatDate(
          shipment.executedAt ||
          shipment.bookingDate,
        ),
      ),

    executedPlace:
      tbd(
        shipment.executedPlace ||
        shipment.origin,
      ),

    shipperSignature:
      tbd(
        shipment.shipperSignatureName,
      ),

    issuingCarrierSignature:
      tbd(
        shipment.issuingCarrierSignatureName,
      ),
  };


  ;


  if (
    pages.length !== 2
  ) {
    throw new Error(
      `Expected 2-page Alliance Air template; found ${pages.length}.`,
    );
  }

  /*
   * Only Page 1 receives shipment data.
   */
  const page =
    pages[0];

  const regular =
    await pdf.embedFont(
      StandardFonts.Helvetica,
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold,
    );

  const origin =
    clean(
      shipment.origin,
    );

  const destination =
    clean(
      shipment.destination,
    );

  const airlineCode =
    clean(
      shipment.airline
        ?.iataDesignator,
    ) ||
    "9I";

  const airlineName =
    clean(
      shipment.airline
        ?.name,
    ) ||
    "Alliance Air";

  const trackingNumber =
    clean(
      shipment.trackingNumber,
    );

  const customerCode =
    clean(
      shipment.customer
        ?.code,
    );

  const flightNumber =
    clean(
      shipment.flightNumber,
    );

  const flightDate =
    formatDate(
      shipment
        .scheduledDeparture ||
        shipment.bookingDate,
    );

  const std =
    formatTime(
      shipment
        .scheduledDeparture,
    );

  const sta =
    formatTime(
      shipment
        .scheduledArrival,
    );

  const aircraftType =
    clean(
      shipment.aircraftType,
    );

  const arrivalTerminal =
    clean(
      shipment.arrivalTerminal,
    );

  const issuingAgent =
    clean(
      shipment.agent
        ?.companyName,
    ) ||
    "Logicarts";

  const issuingCity =
    clean(
      shipment.agent
        ?.city,
    ) ||
    origin;

  /*
   * Do not use Logicarts internal agent code as an
   * IATA cargo-agent code.
   *
   * Keep blank unless a real IATA code is available.
   */
  const agentCode = "";

  /*
   * =========================================================
   * AWB HEADER
   * =========================================================
   */

  const awbSerial =
    trackingNumber.replace(
      /^.*?-/,
      "",
    );

  /* SHIPPER DATA RESTORE */

  drawField(
    page,
    bold,
    clean(shipment.senderName),
    FIELD_MAP.shipper.name,
  );

  const shipperDetails = [
    clean(shipment.senderAddress),
    [
      clean(shipment.senderCity),
      clean(shipment.senderState),
    ]
      .filter(Boolean)
      .join(", "),
    [
      shipment.senderPincode
        ? `PIN: ${shipment.senderPincode}`
        : "",
      shipment.senderGSTIN
        ? `GSTIN: ${shipment.senderGSTIN}`
        : "",
    ]
      .filter(Boolean)
      .join("   "),
    shipment.senderPhone
      ? `Mob: ${shipment.senderPhone}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  drawField(
    page,
    regular,
    shipperDetails,
    FIELD_MAP.shipper.details,
  );

  drawField(
    page,
    bold,
    clean(
      shipment.shipperAccountNumber ||
      shipment.customer?.code,
    ),
    FIELD_MAP.shipper.account,
  );

  /* CONSIGNEE DATA RESTORE */

  drawField(
    page,
    bold,
    clean(shipment.receiverName),
    FIELD_MAP.consignee.name,
  );

  const consigneeDetails = [
    clean(shipment.receiverAddress),
    [
      clean(shipment.receiverCity),
      clean(shipment.receiverState),
    ]
      .filter(Boolean)
      .join(", "),
    [
      shipment.receiverPincode
        ? `PIN: ${shipment.receiverPincode}`
        : "",
      shipment.receiverGSTIN
        ? `GSTIN: ${shipment.receiverGSTIN}`
        : "",
    ]
      .filter(Boolean)
      .join("   "),
    shipment.receiverPhone
      ? `Mob: ${shipment.receiverPhone}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  drawField(
    page,
    regular,
    consigneeDetails,
    FIELD_MAP.consignee.details,
  );

  /* LOGICARTS LOGO RESTORE */

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
        x: 460,
        y: 721,
        width: 82,
        height: 21,
      },
    );
  } catch (error) {
    console.warn(
      "Unable to embed Logicarts logo:",
      error,
    );
  }

  drawField(
    page,
    bold,
    clean(
      shipment.consigneeAccountNumber,
    ),
    FIELD_MAP.consignee.account,
  );

  /*
   * =========================================================
   * ISSUING AGENT
   * =========================================================
   */

  drawField(
    page,
    bold,
    issuingAgent,
    FIELD_MAP.agent.name,
  );

  drawField(
    page,
    regular,
    issuingCity,
    FIELD_MAP.agent.city,
  );

  drawField(
    page,
    bold,
    agentCode,
    FIELD_MAP.agent.iataCode,
  );

  drawField(
    page,
    bold,
    customerCode,
    FIELD_MAP.agent.account,
  );

  /*
   * =========================================================
   * ROUTING
   * =========================================================
   */

  drawField(
    page,
    bold,
    origin,
    FIELD_MAP.routing.origin,
  );

  drawField(
    page,
    bold,
    `${airlineCode} ${airlineName}`,
    FIELD_MAP.routing.carrier,
  );

  drawField(
    page,
    bold,
    destination,
    FIELD_MAP.routing
      .routingDestination,
  );

  drawField(
    page,
    bold,
    "INR",
    FIELD_MAP.routing.currency,
  );

  drawField(
    page,
    bold,
    "PPD",
    FIELD_MAP.routing.wtVal,
  );

  drawField(
    page,
    bold,
    "PPD",
    FIELD_MAP.routing.other,
  );

  /*
   * =========================================================
   * FLIGHT
   * =========================================================
   */

  drawField(
    page,
    bold,
    destination,
    FIELD_MAP.flight.destination,
  );

  drawField(
    page,
    bold,
    flightNumber,
    FIELD_MAP.flight.number,
  );

  drawField(
    page,
    bold,
    flightDate,
    FIELD_MAP.flight.date,
  );

  const carrierUse =
    [
      aircraftType,
      arrivalTerminal
        ? `T${arrivalTerminal}`
        : "",
    ]
      .filter(Boolean)
      .join(" / ");

  drawField(
    page,
    regular,
    carrierUse,
    FIELD_MAP.flight.carrierUse,
  );

  drawField(
    page,
    regular,
    shipment.insuranceAmount != null &&
    Number(shipment.insuranceAmount) > 0
      ? money(
          shipment.insuranceAmount,
        )
      : "",
    FIELD_MAP.flight.insurance,
  );

  /*
   * =========================================================
   * HANDLING
   * =========================================================
   */

  const handling =
    [
      shipment.contents,
      std
        ? `STD ${std}`
        : "",
      sta
        ? `STA ${sta}`
        : "",
    ]
      .filter(Boolean)
      .join(" | ");

  drawField(
    page,
    regular,
    handling,
    FIELD_MAP.handling.text,
  );

  drawField(
    page,
    bold,
    clean(
      shipment
        .specialCargoIndicator,
    ),
    FIELD_MAP.handling.sci,
  );

  /*
   * =========================================================
   * CARGO
   * =========================================================
   */

  const actualWeight =
    Number(
      shipment.actualWeight ||
        0,
    );

  const chargeableWeight =
    Number(
      shipment
        .chargeableWeight ||
        0,
    );

  const freight =
    Number(
      shipment.freight ||
        0,
    );

  const rate =
    chargeableWeight > 0
      ? freight /
        chargeableWeight
      : 0;

  const rateClass =
    clean(
      shipment.rateClass,
    );

  const commodityItem =
    clean(
      shipment
        .commodityItemNumber,
    );

  drawField(
    page,
    bold,
    shipment.packageCount,
    FIELD_MAP.cargo.pieces,
  );

  drawField(
    page,
    regular,
    money(actualWeight),
    FIELD_MAP.cargo.grossWeight,
  );

  drawField(
    page,
    regular,
    "K",
    FIELD_MAP.cargo.unit,
  );

  drawField(
    page,
    regular,
    [
      rateClass,
      commodityItem,
    ]
      .filter(Boolean)
      .join(" / "),
    FIELD_MAP.cargo.rateCommodity,
  );

  drawField(
    page,
    regular,
    money(
      chargeableWeight,
    ),
    FIELD_MAP.cargo
      .chargeableWeight,
  );

  drawField(
    page,
    regular,
    rate > 0
      ? money(rate)
      : "",
    FIELD_MAP.cargo.rate,
  );

  drawField(
    page,
    bold,
    money(freight),
    FIELD_MAP.cargo.charge,
  );

  drawField(
    page,
    bold,
    money(freight),
    FIELD_MAP.cargo.total,
  );

  const packages =
    Array.isArray(
      shipment.packages,
    )
      ? shipment.packages
      : [];

  const dimensions =
    packages
      .slice(0, 8)
      .map(
        (pkg: any) => {
          const l =
            clean(pkg.length);

          const w =
            clean(pkg.width);

          const h =
            clean(pkg.height);

          if (
            !l ||
            !w ||
            !h
          ) {
            return "";
          }

          return `${l} x ${w} x ${h} cm`;
        },
      )
      .filter(Boolean)
      .join(" | ");

  const goods =
    [
      clean(
        shipment.contents,
      ),
      dimensions,
    ]
      .filter(Boolean)
      .join("\n");

  drawField(
    page,
    bold,
    goods,
    FIELD_MAP.cargo.goods,
  );

  /*
   * PAGE 2 IS INTENTIONALLY UNTOUCHED.
   */


  /*
   * =========================================================
   * FULL AWB DATA WIRING
   * Populate everything first.
   * Alignment will be handled later.
   * =========================================================
   */

  // HEADER
  if (FIELD_MAP.header?.airlineCode) {
    drawField(
      page,
      bold,
      awbValue.airlineCode,
      FIELD_MAP.header.airlineCode,
    );
  }

  if (FIELD_MAP.header?.origin) {
    drawField(
      page,
      bold,
      awbValue.origin,
      FIELD_MAP.header.origin,
    );
  }

  if (FIELD_MAP.header?.serial) {
    drawField(
      page,
      bold,
      clean(shipment.trackingNumber)
        .replace(/^.*?-/, ""),
      FIELD_MAP.header.serial,
    );
  }

  if (FIELD_MAP.header?.awbNumberRight) {
    drawField(
      page,
      bold,
      shipment.trackingNumber,
      FIELD_MAP.header.awbNumberRight,
    );
  }

  // SHIPPER
  if (FIELD_MAP.shipper?.name) {
    drawField(
      page,
      bold,
      awbValue.shipperName,
      FIELD_MAP.shipper.name,
    );
  }

  if (FIELD_MAP.shipper?.details) {
    drawField(
      page,
      regular,
      awbValue.shipperDetails,
      FIELD_MAP.shipper.details,
    );
  }

  if (FIELD_MAP.shipper?.account) {
    drawField(
      page,
      bold,
      awbValue.shipperAccount,
      FIELD_MAP.shipper.account,
    );
  }

  // CONSIGNEE
  if (FIELD_MAP.consignee?.name) {
    drawField(
      page,
      bold,
      awbValue.consigneeName,
      FIELD_MAP.consignee.name,
    );
  }

  if (FIELD_MAP.consignee?.details) {
    drawField(
      page,
      regular,
      awbValue.consigneeDetails,
      FIELD_MAP.consignee.details,
    );
  }

  if (FIELD_MAP.consignee?.account) {
    drawField(
      page,
      bold,
      awbValue.consigneeAccount,
      FIELD_MAP.consignee.account,
    );
  }

  // REFERENCE
  if (FIELD_MAP.reference?.number) {
    drawField(
      page,
      bold,
      awbValue.referenceNumber,
      FIELD_MAP.reference.number,
    );
  }

  // ROUTING
  if (FIELD_MAP.routing?.origin) {
    drawField(
      page,
      bold,
      awbValue.origin,
      FIELD_MAP.routing.origin,
    );
  }

  if (FIELD_MAP.routing?.routingDestination) {
    drawField(
      page,
      bold,
      awbValue.destination,
      FIELD_MAP.routing.routingDestination,
    );
  }

  if (FIELD_MAP.routing?.currency) {
    drawField(
      page,
      bold,
      awbValue.currency,
      FIELD_MAP.routing.currency,
    );
  }

  if (FIELD_MAP.routing?.wtVal) {
    drawField(
      page,
      bold,
      awbValue.wtVal,
      FIELD_MAP.routing.wtVal,
    );
  }

  if (FIELD_MAP.routing?.other) {
    drawField(
      page,
      bold,
      awbValue.other,
      FIELD_MAP.routing.other,
    );
  }

  // FLIGHT
  if (FIELD_MAP.flight?.destination) {
    drawField(
      page,
      bold,
      awbValue.destination,
      FIELD_MAP.flight.destination,
    );
  }

  if (FIELD_MAP.flight?.number) {
    drawField(
      page,
      bold,
      awbValue.flightNumber,
      FIELD_MAP.flight.number,
    );
  }

  if (FIELD_MAP.flight?.date) {
    drawField(
      page,
      bold,
      awbValue.flightDate,
      FIELD_MAP.flight.date,
    );
  }

  if (FIELD_MAP.flight?.carrierUse) {
    drawField(
      page,
      regular,
      awbValue.carrierUse,
      FIELD_MAP.flight.carrierUse,
    );
  }

  if (FIELD_MAP.flight?.insurance) {
    drawField(
      page,
      regular,
      awbValue.insurance,
      FIELD_MAP.flight.insurance,
    );
  }

  // HANDLING
  if (FIELD_MAP.handling?.text) {
    drawField(
      page,
      regular,
      awbValue.handling,
      FIELD_MAP.handling.text,
    );
  }

  if (FIELD_MAP.handling?.sci) {
    drawField(
      page,
      bold,
      awbValue.sci,
      FIELD_MAP.handling.sci,
    );
  }

  // CERTIFICATION

  /*
   * =========================================================
   * LOWER ACCOUNTING RESTORE
   * =========================================================
   * Restore data only.
   * Alignment remains controlled by FIELD_MAP.
   */

  if (FIELD_MAP.accounting?.weightCharge) {
    drawField(
      page,
      regular,
      money(
        shipment.freight ?? 0,
      ),
      FIELD_MAP.accounting.weightCharge,
    );
  }

  if (FIELD_MAP.accounting?.collectWeightCharge) {
    drawField(
      page,
      regular,
      money(
        shipment.collectWeightCharge ?? 0,
      ),
      FIELD_MAP.accounting.collectWeightCharge,
    );
  }

  if (FIELD_MAP.accounting?.valuationCharge) {
    drawField(
      page,
      regular,
      money(
        shipment.valuationCharge ?? 0,
      ),
      FIELD_MAP.accounting.valuationCharge,
    );
  }

  if (FIELD_MAP.accounting?.tax) {
    drawField(
      page,
      regular,
      money(
        shipment.gst ?? 0,
      ),
      FIELD_MAP.accounting.tax,
    );
  }

  if (FIELD_MAP.accounting?.otherDueAgent) {
    drawField(
      page,
      regular,
      money(
        shipment.otherChargesDueAgent ?? 0,
      ),
      FIELD_MAP.accounting.otherDueAgent,
    );
  }

  if (FIELD_MAP.accounting?.otherDueCarrier) {
    drawField(
      page,
      regular,
      money(
        shipment.otherChargesDueCarrier ?? 0,
      ),
      FIELD_MAP.accounting.otherDueCarrier,
    );
  }

  if (FIELD_MAP.accounting?.totalPrepaid) {
    drawField(
      page,
      bold,
      money(
        shipment.totalPrepaid ??
        shipment.total ??
        0,
      ),
      FIELD_MAP.accounting.totalPrepaid,
    );
  }

  if (FIELD_MAP.accounting?.totalCollect) {
    drawField(
      page,
      bold,
      money(
        shipment.totalCollect ?? 0,
      ),
      FIELD_MAP.accounting.totalCollect,
    );
  }

  if (FIELD_MAP.accounting?.currency) {
    drawField(
      page,
      regular,
      shipment.currencyConversionRate != null
        ? Number(
            shipment.currencyConversionRate,
          ).toFixed(2)
        : "0.00",
      FIELD_MAP.accounting.currency,
    );
  }

  if (FIELD_MAP.accounting?.destinationCurrency) {
    drawField(
      page,
      regular,
      money(
        shipment.totalCollectCharges ?? 0,
      ),
      FIELD_MAP.accounting.destinationCurrency,
    );
  }

  /*
   * DESTINATION CHARGES RESTORE
   */


  if (FIELD_MAP.certification?.executedOn) {
    drawField(
      page,
      regular,
      awbValue.executedOn,
      FIELD_MAP.certification.executedOn,
    );
  }

  if (FIELD_MAP.certification?.place) {
    drawField(
      page,
      regular,
      awbValue.executedPlace,
      FIELD_MAP.certification.place,
    );
  }

  if (FIELD_MAP.certification?.agent) {
    drawField(
      page,
      bold,
      awbValue.issuingCarrierSignature,
      FIELD_MAP.certification.agent,
    );
  }


  /* DIRECT DESTINATION VALUES */

  // Charges at Destination
  page.drawText(
    "0.00",
    {
      x: 165,
      y: 42,
      size: 5.5,
      font: regular,
      color: rgb(0, 0, 0),
    },
  );

  // Total Collect Charges
  page.drawText(
    "0.00",
    {
      x: 275,
      y: 42,
      size: 5.5,
      font: regular,
      color: rgb(0, 0, 0),
    },
  );

  return pdf.save();
}
