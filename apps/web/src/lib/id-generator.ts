import { prisma } from "@/lib/prisma";

export type LogicartsIdPrefix =
  | "LGCL"
  | "LGAG"
  | "LGEM"
  | "LGCU"
  | "LGRQ";

export async function generateLogicartsId(
  prefix: LogicartsIdPrefix
) {
  const rows = await prisma.$queryRaw<
    Array<{ value: number }>
  >`
    INSERT INTO "LogicartsSequence"
      ("key", "value", "updatedAt")
    VALUES
      (${prefix}, 1, CURRENT_TIMESTAMP)
    ON CONFLICT ("key")
    DO UPDATE SET
      "value" = "LogicartsSequence"."value" + 1,
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "value"
  `;

  const value = rows[0]?.value;

  if (!value) {
    throw new Error(
      `Unable to generate ${prefix} ID`
    );
  }

  return `${prefix}${String(value).padStart(3, "0")}`;
}
