import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

import { prisma } from "../src/lib/prisma";

const SOURCE =
  "ALLIANCE_SCHEDULE";

const INPUT =
  process.argv[2];

if (!INPUT) {
  console.error(
    "Usage: npx tsx scripts/import-alliance-air-schedule.ts <xlsx-file>",
  );
  process.exit(1);
}

function clean(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim();
}

function normaliseAirport(
  value: unknown,
) {
  return clean(value)
    .toUpperCase();
}

function normaliseFlight(
  value: unknown,
) {
  return clean(value)
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function parseDays(
  value: unknown,
): number[] {
  const text =
    clean(value)
      .replace(/\D/g, "");

  return [
    ...new Set(
      [...text]
        .map(Number)
        .filter(
          (d) =>
            d >= 1 &&
            d <= 7,
        ),
    ),
  ];
}

function excelTime(
  value: unknown,
): {
  hour: number;
  minute: number;
} | null {
  if (
    typeof value === "number"
  ) {
    const fraction =
      value % 1;

    const totalMinutes =
      Math.round(
        fraction *
          24 *
          60,
      );

    return {
      hour:
        Math.floor(
          totalMinutes / 60,
        ) % 24,
      minute:
        totalMinutes % 60,
    };
  }

  const text =
    clean(value);

  if (!text) {
    return null;
  }

  const match =
    text.match(
      /^(\d{1,2})[:.]?(\d{2})$/,
    );

  if (match) {
    return {
      hour:
        Number(match[1]),
      minute:
        Number(match[2]),
    };
  }

  const numeric =
    text.match(
      /^(\d{1,2})(\d{2})$/,
    );

  if (numeric) {
    return {
      hour:
        Number(numeric[1]),
      minute:
        Number(numeric[2]),
    };
  }

  return null;
}

function parseDate(
  value: unknown,
): Date | null {
  if (
    value instanceof Date
  ) {
    return value;
  }

  if (
    typeof value === "number"
  ) {
    const parsed =
      XLSX.SSF.parse_date_code(
        value,
      );

    if (!parsed) {
      return null;
    }

    return new Date(
      Date.UTC(
        parsed.y,
        parsed.m - 1,
        parsed.d,
      ),
    );
  }

  const text =
    clean(value);

  if (!text) {
    return null;
  }

  const date =
    new Date(text);

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date;
}

function makeIndiaDateTime(
  date: Date,
  time: {
    hour: number;
    minute: number;
  },
) {
  const year =
    date.getUTCFullYear();

  const month =
    String(
      date.getUTCMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getUTCDate(),
    ).padStart(2, "0");

  const hour =
    String(
      time.hour,
    ).padStart(2, "0");

  const minute =
    String(
      time.minute,
    ).padStart(2, "0");

  return new Date(
    `${year}-${month}-${day}T${hour}:${minute}:00+05:30`,
  );
}

function jsWeekdayToAlliance(
  date: Date,
) {
  const jsDay =
    date.getUTCDay();

  return jsDay === 0
    ? 7
    : jsDay;
}

function addDays(
  date: Date,
  days: number,
) {
  const d =
    new Date(date);

  d.setUTCDate(
    d.getUTCDate() +
      days,
  );

  return d;
}

function findValue(
  row: Record<
    string,
    unknown
  >,
  candidates: string[],
) {
  const entries =
    Object.entries(row);

  for (
    const candidate
    of candidates
  ) {
    const found =
      entries.find(
        ([key]) =>
          key
            .trim()
            .toLowerCase() ===
          candidate
            .trim()
            .toLowerCase(),
      );

    if (found) {
      return found[1];
    }
  }

  return undefined;
}

async function main() {
  const file =
    path.resolve(INPUT);

  if (
    !fs.existsSync(file)
  ) {
    throw new Error(
      `File not found: ${file}`,
    );
  }

  const workbook =
    XLSX.readFile(
      file,
      {
        cellDates: true,
      },
    );

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json<
      Record<string, unknown>
    >(
      sheet,
      {
        defval: "",
      },
    );

  console.log(
    `Rows found: ${rows.length}`,
  );

  const airline =
    await prisma.airline.findFirst({
      where: {
        OR: [
          {
            iataDesignator:
              "9I",
          },
          {
            name: {
              contains:
                "Alliance Air",
              mode:
                "insensitive",
            },
          },
        ],
      },
    });

  if (!airline) {
    throw new Error(
      "Alliance Air airline master not found",
    );
  }

  let saved = 0;
  let skipped = 0;

  for (
    const row
    of rows
  ) {
    const flightNumber =
      normaliseFlight(
        findValue(
          row,
          [
            "Flight No",
            "Flight Number",
            "Flight",
          ],
        ),
      );

    const origin =
      normaliseAirport(
        findValue(
          row,
          [
            "Origin",
            "From",
          ],
        ),
      );

    const destination =
      normaliseAirport(
        findValue(
          row,
          [
            "Destination",
            "To",
          ],
        ),
      );

    const days =
      parseDays(
        findValue(
          row,
          [
            "Days of Operations",
            "Days of Operation",
            "Days",
            "DOW",
          ],
        ),
      );

    const std =
      excelTime(
        findValue(
          row,
          [
            "STD",
            "Departure",
            "Departure Time",
          ],
        ),
      );

    const sta =
      excelTime(
        findValue(
          row,
          [
            "STA",
            "Arrival",
            "Arrival Time",
          ],
        ),
      );

    const aircraftType =
      clean(
        findValue(
          row,
          [
            "Aircraft",
            "Aircraft Type",
            "Equipment",
          ],
        ),
      ) || null;

    const validFrom =
      parseDate(
        findValue(
          row,
          [
            "Valid From",
            "Effective From",
            "From Date",
          ],
        ),
      );

    const validTo =
      parseDate(
        findValue(
          row,
          [
            "Valid To",
            "Effective To",
            "To Date",
          ],
        ),
      );

    if (
      !flightNumber ||
      !origin ||
      !destination ||
      !days.length ||
      !std ||
      !sta ||
      !validFrom ||
      !validTo
    ) {
      skipped++;
      continue;
    }

    for (
      let date =
        new Date(validFrom);
      date <= validTo;
      date =
        addDays(date, 1)
    ) {
      const dow =
        jsWeekdayToAlliance(
          date,
        );

      if (
        !days.includes(dow)
      ) {
        continue;
      }

      const departure =
        makeIndiaDateTime(
          date,
          std,
        );

      let arrival =
        makeIndiaDateTime(
          date,
          sta,
        );

      if (
        arrival <=
        departure
      ) {
        arrival =
          new Date(
            arrival.getTime() +
              24 *
              60 *
              60 *
              1000,
          );
      }

      await prisma.flightSchedule.upsert({
        where: {
          flightNumber_origin_destination_scheduledDeparture: {
            flightNumber,
            origin,
            destination,
            scheduledDeparture:
              departure,
          },
        },

        update: {
          airlineId:
            airline.id,

          scheduledArrival:
            arrival,

          aircraftType,

          source:
            SOURCE,

          active:
            true,
        },

        create: {
          airlineId:
            airline.id,

          flightNumber,
          origin,
          destination,

          scheduledDeparture:
            departure,

          scheduledArrival:
            arrival,

          aircraftType,

          source:
            SOURCE,

          active:
            true,
        },
      });

      saved++;
    }
  }

  console.log({
    source:
      SOURCE,
    importedSchedules:
      saved,
    skippedRows:
      skipped,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(
    async () => {
      await prisma.$disconnect();
    },
  );
