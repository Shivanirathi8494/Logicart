import { prisma } from "@/lib/prisma";
import { generateAwbNumber } from "@/lib/airwaybill/generateAwbNumber";
import { airportByCode } from "@/lib/master/airports";
import { recordShipmentTrackingEvent } from "@/lib/tracking/recordShipmentTrackingEvent";
import { resolveClientPricing } from "@/lib/pricing/clientPricing";
import { resolveStandardAirlinePricing } from "@/lib/pricing/standardAirlinePricing";

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

  static async create(
    data: any,
    ownership?: {
      clientId?: string | null;
      agentId?: string | null;
      createdByUserId?: string | null;
      userRole?: string | null;
    },
  ) {
    if (!data.airlineId) {
      throw new Error("Airline is required.");
    }

    if (!data.flightNumber?.trim()) {
      throw new Error("Flight number is required.");
    }

    const isClientBooking = ownership?.userRole === "CLIENT";

    if (isClientBooking && !ownership?.clientId) {
      throw new Error("Your user account is not linked to a Client ID.");
    }

    const trackingNumber = await generateAwbNumber(data.airlineId);

    console.log("Generated AWB:", trackingNumber);

    return prisma.$transaction(
      async (tx) => {
        /*
         * FINAL CLIENT PRICING
         *
         * Resolve the active negotiated contract inside
         * the same transaction used for:
         *
         * - Shipment
         * - Pricing snapshot
         * - Wallet debit
         * - Wallet ledger
         * - BOOKED tracking event
         *
         * Browser freight/gst/total are never authoritative
         * for CLIENT bookings.
         */
        /*
         * CLIENT BOOKING PRICING
         * ----------------------
         *
         * One server-authoritative result is used for:
         *
         * - shipment monetary values
         * - pricing snapshot
         * - prepaid wallet debit
         *
         * Pricing hierarchy:
         *
         * 1. Negotiated client rate card
         * 2. Selected airline standard backend tariff
         */
        let bookingPricing: any = null;

        if (isClientBooking && ownership?.clientId) {
          /*
           * Never trust browser-supplied weight totals.
           * Recalculate from package rows.
           */
          const packages = Array.isArray(data.packages) ? data.packages : [];

          if (packages.length === 0) {
            throw new Error("At least one package is required.");
          }

          const actualWeight = Number(
            packages
              .reduce(
                (sum: number, pkg: any) => sum + Number(pkg.weight || 0),
                0,
              )
              .toFixed(2),
          );

          const volumetricWeight = Number(
            packages
              .reduce((sum: number, pkg: any) => {
                const length = Number(pkg.length || 0);

                const width = Number(pkg.width || 0);

                const height = Number(pkg.height || 0);

                if (length <= 0 || width <= 0 || height <= 0) {
                  return sum;
                }

                return sum + (length * width * height) / 6000;
              }, 0)
              .toFixed(2),
          );

          const chargeableWeight = Number(
            Math.max(actualWeight, volumetricWeight).toFixed(2),
          );

          if (chargeableWeight <= 0) {
            throw new Error("Chargeable weight must be greater than zero.");
          }

          const origin = String(data.origin || "")
            .trim()
            .toUpperCase();

          const destination = String(data.destination || "")
            .trim()
            .toUpperCase();

          let serviceType = String(data.serviceType || "")
            .trim()
            .toUpperCase();

          const pricingDate = new Date();

          /*
           * Find every negotiated service currently
           * available for this client + route.
           */
          const routes = await tx.clientRateRoute.findMany({
            where: {
              origin,
              destination,

              rateContract: {
                clientId: ownership.clientId,

                status: "ACTIVE",

                effectiveFrom: {
                  lte: pricingDate,
                },

                OR: [
                  {
                    effectiveUntil: null,
                  },
                  {
                    effectiveUntil: {
                      gte: pricingDate,
                    },
                  },
                ],
              },
            },

            select: {
              serviceType: true,
            },
          });

          const serviceTypes = [
            ...new Set(
              routes
                .map((route) =>
                  String(route.serviceType || "")
                    .trim()
                    .toUpperCase(),
                )
                .filter(Boolean),
            ),
          ];

          /*
           * CONTRACTED ROUTE
           */
          if (serviceTypes.length > 0) {
            if (!serviceType) {
              if (serviceTypes.length > 1) {
                throw new Error("Select a service type for this route.");
              }

              serviceType = serviceTypes[0];
            }

            if (!serviceTypes.includes(serviceType)) {
              throw new Error(
                "Selected service type is not contracted for this route.",
              );
            }

            const contracted = await resolveClientPricing(
              {
                clientId: ownership.clientId,

                origin,
                destination,
                serviceType,

                actualWeight,
                volumetricWeight,
                chargeableWeight,
              },
              tx,
            );

            bookingPricing = {
              ...contracted,

              pricingSource: "CLIENT_RATE_CARD",

              actualWeight,
              volumetricWeight,
              chargeableWeight,
            };
          } else {
            /*
             * NO CONTRACTED ROUTE
             *
             * Client may still book.
             * Price comes from the selected airline's
             * standard backend GCR tariff.
             */
            const airlineId = String(data.airlineId || "").trim();

            if (!airlineId) {
              throw new Error(
                "Select an airline to calculate the standard rate.",
              );
            }

            const standard = await resolveStandardAirlinePricing(
              {
                airlineId,
                origin,
                destination,
                chargeableWeight,
              },
              tx,
            );

            bookingPricing = {
              ...standard,

              pricingSource: "STANDARD_RATE",

              rateContractId: null,
              contractVersion: null,

              actualWeight,
              volumetricWeight,
              chargeableWeight,
            };
          }

          /*
           * Persist only server-authoritative values.
           */
          data.serviceType = bookingPricing.serviceType;

          data.actualWeight = bookingPricing.actualWeight;

          data.volumetricWeight = bookingPricing.volumetricWeight;

          data.chargeableWeight = bookingPricing.chargeableWeight;
        }

        const shipment = await tx.shipment.create({
          data: {
            trackingNumber,

            customerId: data.customerId,
            clientId: ownership?.clientId ?? null,
            agentId: ownership?.agentId ?? null,
            createdByUserId: ownership?.createdByUserId ?? null,

            bookingDate: new Date(data.bookingDate),

            scheduledDeparture: data.scheduledDeparture
              ? new Date(data.scheduledDeparture)
              : null,

            scheduledArrival: data.scheduledArrival
              ? new Date(data.scheduledArrival)
              : null,

            aircraftType: data.aircraftType || null,

            departureTerminal: data.departureTerminal || null,

            arrivalTerminal: data.arrivalTerminal || null,

            origin: data.origin,
            destination: data.destination,

            status: "BOOKED",

            // Sender
            senderName: data.senderName,
            senderPhone: data.senderPhone,
            invoiceNumber: data.invoiceNumber?.trim() || null,

            invoiceValue:
              data.invoiceValue !== undefined &&
              data.invoiceValue !== null &&
              String(data.invoiceValue).trim() !== ""
                ? Number(data.invoiceValue)
                : null,

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

            /*
             * CLIENT monetary values come only from
             * the negotiated rate card calculation.
             *
             * Existing internal/admin booking flows
             * retain their current tariff behavior.
             */
            freight: bookingPricing
              ? bookingPricing.freightAmount
              : data.freight,

            gst: bookingPricing ? bookingPricing.gstAmount : data.gst,

            total: bookingPricing ? bookingPricing.totalAmount : data.total,

            paymentReference: data.paymentReference || null,
            remarks: data.remarks || null,

            packages: {
              create: data.packages.map((pkg: any) => ({
                length: pkg.length,
                width: pkg.width,
                height: pkg.height,
                weight: Number(pkg.weight || 0),
              })),
            },
          },

          include: {
            packages: true,
          },
        });

        /*
         * Preserve the exact commercial calculation
         * used for this AWB forever.
         *
         * Future rate-card changes must never change
         * historical shipment pricing.
         */
        if (bookingPricing && ownership?.clientId) {
          await tx.shipmentPricingSnapshot.create({
            data: {
              shipmentId: shipment.id,

              rateContractId: bookingPricing.rateContractId,

              contractVersion: bookingPricing.contractVersion,

              pricingSource: bookingPricing.pricingSource,

              serviceType: bookingPricing.serviceType,

              actualWeight: bookingPricing.actualWeight,

              volumetricWeight: bookingPricing.volumetricWeight,

              chargeableWeight: bookingPricing.chargeableWeight,

              ratePerKg: bookingPricing.ratePerKg,

              freightAmount: bookingPricing.freightAmount,

              minimumFreight: bookingPricing.minimumFreight,

              awbCharge: bookingPricing.awbCharge,

              handlingCharge: bookingPricing.handlingCharge,

              pickupCharge: bookingPricing.pickupCharge,

              deliveryCharge: bookingPricing.deliveryCharge,

              fuelSurcharge: bookingPricing.fuelSurcharge,

              subtotal: bookingPricing.subtotal,

              gstAmount: bookingPricing.gstAmount,

              totalAmount: bookingPricing.totalAmount,
            },
          });

          const client = await tx.client.findUnique({
            where: {
              id: ownership.clientId,
            },

            select: {
              billingType: true,
            },
          });

          if (!client) {
            throw new Error("Client account was not found.");
          }

          if (client.billingType === "PREPAID_WALLET") {
            const wallet = await tx.clientWallet.findUnique({
              where: {
                clientId: ownership.clientId,
              },

              select: {
                id: true,
                balance: true,
              },
            });

            if (!wallet) {
              throw new Error("Client wallet is not configured.");
            }

            const bookingAmount = bookingPricing.totalAmount;

            /*
             * Conditional atomic debit:
             *
             * only update the wallet when the
             * current DB balance can cover the
             * complete booking amount.
             *
             * This protects against concurrent
             * bookings spending the same balance.
             */
            const debitedWalletRows = await tx.$queryRaw<
              Array<{ balance: unknown }>
            >`
              UPDATE "ClientWallet"
              SET
                "balance" =
                  "balance" - ${bookingAmount},
                "updatedAt" = NOW()
              WHERE
                "id" = ${wallet.id}
                AND "balance" >= ${bookingAmount}
              RETURNING "balance"
            `;

            const debitedWallet = debitedWalletRows[0];

            if (!debitedWallet) {
              throw new Error("Insufficient prepaid wallet balance.");
            }

            const balanceAfter = Number(debitedWallet.balance);

            /*
             * Derive balanceBefore from the exact
             * successful atomic debit result.
             *
             * Do not reuse the wallet balance that
             * was read before UPDATE because another
             * booking may have changed it meanwhile.
             */
            const balanceBefore = Number(
              (balanceAfter + bookingAmount).toFixed(2),
            );

            await tx.clientWalletTransaction.create({
              data: {
                walletId: wallet.id,

                clientId: ownership.clientId,

                shipmentId: shipment.id,

                type: "BOOKING_DEBIT",

                amount: bookingAmount,

                balanceBefore,

                balanceAfter,

                reference: shipment.trackingNumber,

                remarks: `Booking debit for AWB ${shipment.trackingNumber}`,

                createdByUserId: ownership.createdByUserId ?? null,
              },
            });
          }
        }

        const originCode = String(shipment.origin ?? "")
          .trim()
          .toUpperCase();

        const originAirport = airportByCode[originCode];

        await recordShipmentTrackingEvent({
          db: tx,
          shipmentId: shipment.id,
          status: "BOOKED",
          locationCode: originCode,
          locationName: originAirport?.city ?? originCode,
          createdByUserId: ownership?.createdByUserId ?? null,
          remarks: "Shipment booked",
          eventAt: shipment.createdAt,
        });

        return shipment;
      },
      {
        /*
         * This transaction includes client pricing,
         * shipment creation, pricing snapshot,
         * prepaid wallet debit, wallet ledger and
         * BOOKED tracking audit.
         *
         * Remote database round trips can exceed
         * Prisma's default 5 second interactive
         * transaction timeout.
         */
        maxWait: 10_000,
        timeout: 30_000,
      },
    );
  }
}
