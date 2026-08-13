import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const airlines = [
  {
    name: "Air India",
    iataDesignator: "AI",
    icaoCode: "AIC",
    iataPrefix: "098",
  },
  {
    name: "Air India Express",
    iataDesignator: "IX",
    icaoCode: "AXB",
    iataPrefix: "236",
  },
  {
    name: "Alliance Air",
    iataDesignator: "9I",
    icaoCode: "LLR",
    iataPrefix: "296",
  },
  {
    name: "IndiaOne Air",
    iataDesignator: "I7",
    icaoCode: "IOA",
    iataPrefix: null,
  },
  {
    name: "Star Air",
    iataDesignator: "S5",
    icaoCode: "SDG",
    iataPrefix: null,
  },
  {
    name: "IndiGo",
    iataDesignator: "6E",
    icaoCode: "IGO",
    iataPrefix: "312",
  },
  {
    name: "FLY91",
    iataDesignator: "IC",
    icaoCode: "GOA",
    iataPrefix: null,
  },
  {
    name: "Akasa Air",
    iataDesignator: "QP",
    icaoCode: "AKJ",
    iataPrefix: "516",
  },
  {
    name: "SpiceJet",
    iataDesignator: "SG",
    icaoCode: "SEJ",
    iataPrefix: "775",
  },
  {
    name: "Blue Dart Aviation",
    iataDesignator: "BZ",
    icaoCode: "BDA",
    iataPrefix: "620",
  },
  {
    name: "QuikJet Cargo",
    iataDesignator: "QO",
    icaoCode: "FQA",
    iataPrefix: "723",
  },
];

async function main() {
  for (const airline of airlines) {
    await prisma.airline.upsert({
      where: {
        iataDesignator: airline.iataDesignator,
      },
      update: {
        name: airline.name,
        icaoCode: airline.icaoCode,
        iataPrefix: airline.iataPrefix,
        country: "India",
        active: true,
      },
      create: {
        name: airline.name,
        iataDesignator: airline.iataDesignator,
        icaoCode: airline.icaoCode,
        iataPrefix: airline.iataPrefix,
        country: "India",
        active: true,
      },
    });
  }

  console.log(`✓ Seeded ${airlines.length} active Indian airlines`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
