import { prisma } from "@/lib/prisma";
import { generateTrackingNumber } from "@/lib/docket/generateTrackingNumber";

export class ShipmentService {

  static async getAll() {

    return prisma.shipment.findMany({

      include: {
        packages: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }

  static async create(data: any) {

    const trackingNumber = await generateTrackingNumber(
      data.origin,
      data.destination,
    );

    console.log("Generated AWB:", trackingNumber);

    return prisma.shipment.create({

      data: {

        trackingNumber,

        bookingDate: new Date(data.bookingDate),

        origin: data.origin,
        destination: data.destination,

        status: "BOOKED",

        // Sender
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        senderGSTIN: data.senderGSTIN || null,
        senderPincode: data.senderPincode || null,
        senderState: data.senderState || null,
        senderCity: data.senderCity || null,
        senderAddress: data.senderAddress,

        // Receiver
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        receiverGSTIN: data.receiverGSTIN || null,
        receiverPincode: data.receiverPincode || null,
        receiverState: data.receiverState || null,
        receiverCity: data.receiverCity || null,
        receiverAddress: data.receiverAddress,

        packageCount: data.packageCount,

        actualWeight: data.actualWeight,
        volumetricWeight: data.volumetricWeight,
        chargeableWeight: data.chargeableWeight,

        contents: data.contents,

        freight: data.freight,
        gst: data.gst,
        total: data.total,

        paymentReference: data.paymentReference || null,
        remarks: data.remarks || null,

        packages: {
          create: data.packages.map((pkg: any) => ({
            length: pkg.length,
            width: pkg.width,
            height: pkg.height,
          })),
        },

      },

      include: {
        packages: true,
      },

    });

  }

}
