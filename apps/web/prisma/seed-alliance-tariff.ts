import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";

const prisma = new PrismaClient();

const file =
  "/Users/shivanirathi/Downloads/Alliance Air All India Cargo Tariff.xlsx";

async function main() {
  const airline = await prisma.airline.findUnique({
    where: {
      iataDesignator: "9I",
    },
  });

  if (!airline) {
    throw new Error("Alliance Air (9I) not found.");
  }

  const workbook = XLSX.readFile(file);
  const sheet = workbook.Sheets["GCR"];

  if (!sheet) {
    throw new Error("GCR sheet not found.");
  }

  const rows = XLSX.utils.sheet_to_json<any[]>(sheet, {
    header: 1,
    defval: null,
  });

  const headerIndex = rows.findIndex(
    (row) =>
      row?.[0] === "S.No" &&
      row?.[2] === "Origin" &&
      row?.[3] === "Destination",
  );

  if (headerIndex === -1) {
    throw new Error("GCR header row not found.");
  }

  let imported = 0;

  for (const row of rows.slice(headerIndex + 1)) {
    const [
      serial,
      sector,
      origin,
      destination,
      cargoType,
      minimumCharge,
      normalRate,
      rate45Plus,
      rate100Plus,
    ] = row;

    if (
      !origin ||
      !destination ||
      !cargoType ||
      minimumCharge == null ||
      normalRate == null ||
      rate45Plus == null ||
      rate100Plus == null
    ) {
      continue;
    }

    await prisma.airCargoTariff.upsert({
      where: {
        airlineId_origin_destination_cargoType: {
          airlineId: airline.id,
          origin: String(origin).trim().toUpperCase(),
          destination: String(destination).trim().toUpperCase(),
          cargoType: String(cargoType).trim().toUpperCase(),
        },
      },

      create: {
        airlineId: airline.id,
        origin: String(origin).trim().toUpperCase(),
        destination: String(destination).trim().toUpperCase(),
        cargoType: String(cargoType).trim().toUpperCase(),
        minimumCharge: Number(minimumCharge),
        normalRate: Number(normalRate),
        rate45Plus: Number(rate45Plus),
        rate100Plus: Number(rate100Plus),
      },

      update: {
        minimumCharge: Number(minimumCharge),
        normalRate: Number(normalRate),
        rate45Plus: Number(rate45Plus),
        rate100Plus: Number(rate100Plus),
        active: true,
      },
    });

    imported++;
  }

  console.log(`✓ Imported ${imported} Alliance Air GCR tariff routes`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
