import { prisma } from "@/lib/prisma";
import { generateManifestNumber } from "@/lib/manifest/generateManifestNumber";

export class ManifestService {

  static async create(data: any) {

    const manifestNumber =
      await generateManifestNumber(data.origin);

    return prisma.$transaction(async (tx) => {

      const shipments = await tx.shipment.findMany({

        where: {
          trackingNumber: {
            in: data.shipments,
          },
        },

      });

      if (shipments.length !== data.shipments.length) {

        throw new Error(
          "One or more AWBs were not found."
        );

      }

      const manifest = await tx.manifest.create({

        data: {

          manifestNumber,

          manifestDate: new Date(data.manifestDate),

          origin: data.origin,

          destination: data.destination,

          flightNumber: data.flightNumber,

          vehicleNumber: data.vehicleNumber,

          remarks: data.remarks,

          shipments: {

            create: shipments.map((shipment) => ({

              shipment: {

                connect: {

                  id: shipment.id,

                },

              },

            })),

          },

        },

        include: {

          shipments: {

            include: {

              shipment: true,

            },

          },

        },

      });

      await tx.shipment.updateMany({

        where: {

          id: {

            in: shipments.map(
              s => s.id
            ),

          },

        },

        data: {

          status: "MANIFESTED",

        },

      });

      return manifest;

    });

  }

}
