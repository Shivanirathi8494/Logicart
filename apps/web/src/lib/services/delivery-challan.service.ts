import { prisma } from "@/lib/prisma";
import { generateChallanNumber } from "@/lib/challan/generateChallanNumber";

export class DeliveryChallanService {

  static async create(data: any) {

    const challanNumber = await generateChallanNumber(data.origin);

    return prisma.$transaction(async (tx) => {

      const challan = await tx.deliveryChallan.create({

        data: {

          challanNumber,

          challanDate: new Date(),

          manifestId: data.manifestId ?? null,

          customerName: data.customerName,

          customerAddress: data.customerAddress,

          customerPhone: data.customerPhone,

          flightNumber: data.flightNumber,

          vehicleNumber: data.vehicleNumber,

          remarks: data.remarks,

          shipments: {

            create: data.shipments.map((id: string) => ({

              shipment: {
                connect: {
                  id,
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

      return challan;

    });

  }

}
