import crypto from "node:crypto";
import { PassThrough } from "node:stream";
import { ZipArchive } from "archiver";

import { prisma } from "@/lib/prisma";
import { putArchive, verifyArchive } from "./storage";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type ArchiveResult =
  | {
      created: true;
      archiveId: string;
      archiveKey: string;
      shipmentCount: number;
      checksum: string;
      size: number;
      periodStart: Date;
      periodEnd: Date;
    }
  | {
      created: false;
      reason: string;
      periodStart: Date;
      periodEnd: Date;
    };

function serializeForArchive(value: unknown): string {
  return JSON.stringify(
    value,
    (_key, currentValue) => {
      if (typeof currentValue === "bigint") {
        return currentValue.toString();
      }

      // Prisma Decimal objects serialize safely through toJSON().
      return currentValue;
    },
    2,
  );
}

/**
 * Returns the most recently completed 7-day IST window.
 *
 * Windows are anchored to Monday 00:00 IST:
 * Monday 00:00 IST -> following Monday 00:00 IST.
 */
export function getLastCompletedArchivePeriod(now = new Date()): {
  periodStart: Date;
  periodEnd: Date;
} {
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);

  const year = istNow.getUTCFullYear();
  const month = istNow.getUTCMonth();
  const date = istNow.getUTCDate();

  const todayIstMidnightAsUtc = Date.UTC(year, month, date);

  const day = new Date(todayIstMidnightAsUtc).getUTCDay();
  const daysSinceMonday = (day + 6) % 7;

  const currentMondayIstAsUtc =
    todayIstMidnightAsUtc - daysSinceMonday * 24 * 60 * 60 * 1000;

  // Convert the conceptual IST midnight back to a real UTC instant.
  const periodEnd = new Date(currentMondayIstAsUtc - IST_OFFSET_MS);
  const periodStart = new Date(periodEnd.getTime() - SEVEN_DAYS_MS);

  return {
    periodStart,
    periodEnd,
  };
}

function formatIstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function createZipBuffer(
  files: Array<{ name: string; content: string }>,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];

    output.on("data", (chunk: Buffer) => {
      chunks.push(Buffer.from(chunk));
    });

    output.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    output.on("error", reject);

    const zip = new ZipArchive({
      zlib: { level: 9 },
    });

    zip.on("warning", (error: Error & { code?: string }) => {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.warn("Archive warning:", error.message);
        return;
      }

      reject(error);
    });

    zip.on("error", reject);

    zip.pipe(output);

    for (const file of files) {
      zip.append(file.content, { name: file.name });
    }

    void zip.finalize();
  });
}

export async function createDeliveredArchive(
  periodStart: Date,
  periodEnd: Date,
): Promise<ArchiveResult> {
  if (
    Number.isNaN(periodStart.getTime()) ||
    Number.isNaN(periodEnd.getTime()) ||
    periodStart >= periodEnd
  ) {
    throw new Error("Invalid archive period.");
  }

  const existingPeriod = await prisma.deliveredArchive.findUnique({
    where: {
      delivered_archive_period: {
        periodStart,
        periodEnd,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (
    existingPeriod?.status === "CREATING" ||
    existingPeriod?.status === "VERIFIED"
  ) {
    return {
      created: false,
      reason: `Archive period already exists with status ${existingPeriod.status}.`,
      periodStart,
      periodEnd,
    };
  }

  /*
   * Find DELIVERED events first.
   *
   * The event timestamp, rather than Shipment.updatedAt, determines which
   * seven-day period owns the AWB.
   */
  const deliveredEvents = await prisma.shipmentTrackingEvent.findMany({
    where: {
      status: "DELIVERED",
      eventAt: {
        gte: periodStart,
        lt: periodEnd,
      },
      shipment: {
        status: "DELIVERED",
      },
    },
    orderBy: {
      eventAt: "asc",
    },
    select: {
      shipmentId: true,
      eventAt: true,
    },
  });

  /*
   * Defensive de-duplication in case an AWB has more than one DELIVERED
   * tracking event.
   */
  const deliveredAtByShipment = new Map<string, Date>();

  for (const event of deliveredEvents) {
    const existing = deliveredAtByShipment.get(event.shipmentId);

    if (!existing || event.eventAt < existing) {
      deliveredAtByShipment.set(event.shipmentId, event.eventAt);
    }
  }

  const candidateShipmentIds = [...deliveredAtByShipment.keys()];

  if (candidateShipmentIds.length === 0) {
    return {
      created: false,
      reason: "No delivered shipments exist in this period.",
      periodStart,
      periodEnd,
    };
  }

  // Explicitly exclude AWBs already present in any archive.
  const existingMemberships = await prisma.deliveredArchiveShipment.findMany({
    where: {
      shipmentId: {
        in: candidateShipmentIds,
      },
    },
    select: {
      shipmentId: true,
    },
  });

  const alreadyArchived = new Set(
    existingMemberships.map((item) => item.shipmentId),
  );

  const shipmentIds = candidateShipmentIds.filter(
    (shipmentId) => !alreadyArchived.has(shipmentId),
  );

  if (shipmentIds.length === 0) {
    return {
      created: false,
      reason: "All delivered shipments in this period are already archived.",
      periodStart,
      periodEnd,
    };
  }

  const shipments = await prisma.shipment.findMany({
    where: {
      id: {
        in: shipmentIds,
      },
      status: "DELIVERED",
    },
    include: {
      packages: {
        include: {
          loadingTallyPackages: {
            include: {
              loadingTally: true,
            },
          },
          manifestUnloadPackages: {
            include: {
              manifest: true,
            },
          },
        },
      },

      trackingEvents: {
        orderBy: {
          eventAt: "asc",
        },
        select: {
          id: true,
          shipmentId: true,
          status: true,
          eventType: true,
          locationCode: true,
          locationName: true,
          eventAt: true,
          createdByUserId: true,
          remarks: true,
          createdAt: true,
        },
      },

      manifestEntries: {
        include: {
          manifest: true,
        },
      },

      loadingTallies: {
        include: {
          loadingTally: true,
          manifest: true,
        },
      },

      deliveryChallans: {
        include: {
          challan: true,
        },
      },

      deliveryAttempts: {
        orderBy: {
          attemptedAt: "asc",
        },
        select: {
          id: true,
          shipmentId: true,
          createdByUserId: true,
          outcome: true,
          remarks: true,
          receiverName: true,
          receiverPhone: true,
          receiverAddress: true,
          attemptedAt: true,
        },
      },

      outForDeliveryRecords: {
        orderBy: {
          dispatchedAt: "asc",
        },
        select: {
          id: true,
          shipmentId: true,
          vehicleNumber: true,
          receiverName: true,
          receiverPhone: true,
          receiverAddress: true,
          remarks: true,
          dispatchedAt: true,
          createdByUserId: true,
        },
      },

      pricingSnapshot: true,

      walletTransactions: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          walletId: true,
          clientId: true,
          shipmentId: true,
          type: true,
          amount: true,
          balanceBefore: true,
          balanceAfter: true,
          reference: true,
          remarks: true,
          createdByUserId: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      trackingNumber: "asc",
    },
  });

  if (shipments.length === 0) {
    return {
      created: false,
      reason: "No eligible delivered shipments were found.",
      periodStart,
      periodEnd,
    };
  }

  const startLabel = formatIstDate(periodStart);
  const endLabel = formatIstDate(new Date(periodEnd.getTime() - 1));

  const archiveId = existingPeriod?.id ?? crypto.randomUUID();

  const fileName = `logicarts-delivered-${startLabel}-to-${endLabel}-${archiveId}.zip`;

  const archiveKey = `delivered/${periodStart.getUTCFullYear()}/${fileName}`;

  if (existingPeriod?.status === "FAILED") {
    await prisma.deliveredArchive.update({
      where: {
        id: archiveId,
      },
      data: {
        shipmentCount: shipments.length,
        archiveKey,
        fileName,
        fileSize: null,
        checksum: null,
        status: "CREATING",
        failureReason: null,
        verifiedAt: null,
      },
    });
  } else {
    await prisma.deliveredArchive.create({
      data: {
        id: archiveId,
        periodStart,
        periodEnd,
        shipmentCount: shipments.length,
        archiveKey,
        fileName,
        status: "CREATING",
      },
    });
  }

  try {
    const exportedAt = new Date();

    const manifest = {
      formatVersion: 1,
      archiveId,
      generatedAt: exportedAt,
      timezone: "Asia/Kolkata",
      periodStart,
      periodEnd,
      shipmentCount: shipments.length,
      trackingNumbers: shipments.map((shipment) => shipment.trackingNumber),
    };

    const shipmentDocuments = shipments.map((shipment) => ({
      deliveredAt: deliveredAtByShipment.get(shipment.id) ?? null,
      shipment,
    }));

    const zip = await createZipBuffer([
      {
        name: "manifest.json",
        content: serializeForArchive(manifest),
      },
      {
        name: "shipments.json",
        content: serializeForArchive(shipmentDocuments),
      },
    ]);

    const stored = await putArchive(archiveKey, zip);

    const verification = await verifyArchive(
      archiveKey,
      stored.checksum,
      stored.size,
    );

    if (!verification.verified) {
      throw new Error(
        `Archive verification failed. Expected SHA-256 ${stored.checksum}, ` +
          `received ${verification.checksum}.`,
      );
    }

    /*
     * Membership rows are written only after the archive has been uploaded
     * and successfully read back.
     *
     * shipmentId is UNIQUE at the database level, providing another
     * protection against archiving the same AWB twice.
     */
    await prisma.$transaction([
      prisma.deliveredArchiveShipment.createMany({
        data: shipments.map((shipment) => ({
          archiveId,
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
        })),
      }),

      prisma.deliveredArchive.update({
        where: {
          id: archiveId,
        },
        data: {
          shipmentCount: shipments.length,
          fileSize: BigInt(stored.size),
          checksum: stored.checksum,
          status: "VERIFIED",
          verifiedAt: new Date(),
          failureReason: null,
        },
      }),
    ]);

    return {
      created: true,
      archiveId,
      archiveKey,
      shipmentCount: shipments.length,
      checksum: stored.checksum,
      size: stored.size,
      periodStart,
      periodEnd,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message.slice(0, 2000)
        : "Unknown archive creation failure.";

    await prisma.deliveredArchive.update({
      where: {
        id: archiveId,
      },
      data: {
        status: "FAILED",
        failureReason: message,
      },
    });

    throw error;
  }
}

export async function createLastCompletedDeliveredArchive() {
  const { periodStart, periodEnd } = getLastCompletedArchivePeriod();

  return createDeliveredArchive(periodStart, periodEnd);
}

export async function createPendingDeliveredArchives(maxPeriods = 8) {
  const safeMaxPeriods = Math.min(Math.max(Math.trunc(maxPeriods) || 1, 1), 52);

  const { periodEnd: completedThrough } = getLastCompletedArchivePeriod();

  /*
   * Find only completed IST weeks that still contain at least one
   * DELIVERED shipment which has never been archived.
   *
   * This means:
   * - empty weeks are skipped;
   * - already archived AWBs are skipped;
   * - missed older weeks are processed oldest-first;
   * - a scheduler outage does not permanently lose an eligible week.
   */
  const pendingPeriods = await prisma.$queryRaw<Array<{ periodStart: Date }>>`
    SELECT DISTINCT
      (
        date_trunc(
          'week',
          ste."eventAt" AT TIME ZONE 'Asia/Kolkata'
        ) AT TIME ZONE 'Asia/Kolkata'
      ) AS "periodStart"
    FROM "ShipmentTrackingEvent" ste
    INNER JOIN "Shipment" s
      ON s."id" = ste."shipmentId"
    LEFT JOIN "delivered_archive_shipments" das
      ON das."shipmentId" = ste."shipmentId"
    WHERE
      ste."status"::text = 'DELIVERED'
      AND s."status"::text = 'DELIVERED'
      AND ste."eventAt" < ${completedThrough}
      AND das."id" IS NULL
    ORDER BY "periodStart" ASC
    LIMIT ${safeMaxPeriods}
  `;

  const results: Array<{
    periodStart: Date;
    periodEnd: Date;
    ok: boolean;
    created?: boolean;
    shipmentCount?: number;
    reason?: string;
    error?: string;
  }> = [];

  for (const pending of pendingPeriods) {
    const periodStart = new Date(pending.periodStart);
    const periodEnd = new Date(periodStart.getTime() + SEVEN_DAYS_MS);

    if (periodEnd > completedThrough) {
      continue;
    }

    try {
      const result = await createDeliveredArchive(periodStart, periodEnd);

      results.push({
        periodStart,
        periodEnd,
        ok: true,
        created: result.created,
        shipmentCount: result.created ? result.shipmentCount : undefined,
        reason: result.created ? undefined : result.reason,
      });
    } catch (error) {
      results.push({
        periodStart,
        periodEnd,
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown archive creation failure.",
      });
    }
  }

  return {
    completedThrough,
    maxPeriods: safeMaxPeriods,
    eligiblePeriodsFound: pendingPeriods.length,
    processed: results.length,
    succeeded: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  };
}
