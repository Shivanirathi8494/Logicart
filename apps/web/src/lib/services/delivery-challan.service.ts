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

          deliveryType:
            data.deliveryType === "AIRPORT_DELIVERY"
              ? "AIRPORT_DELIVERY"
              : "DOOR_TO_DOOR",

          customerName: data.customerName.trim(),

          customerAddress: data.customerAddress.trim(),

          customerPhone: data.customerPhone.trim(),

          flightNumber: null,

          vehicleNumber: null,

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

      /*
       * Airport Delivery Challan is only the handover
       * record to the airport/vendor.
       *
       * It must NOT move the shipment into
       * OUT_FOR_DELIVERY. Final-mile delivery will be
       * started separately from the Out for Delivery flow.
       */
      const stillAvailable = await tx.shipment.count({
        where: {
          id: {
            in: data.shipments,
          },
          status: "OUTSCAN",
        },
      });

      if (stillAvailable !== data.shipments.length) {
        throw new Error(
          "One or more shipments are no longer available for airport handover.",
        );
      }

      return challan;
    });
  }
}
