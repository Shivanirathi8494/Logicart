import { randomBytes } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendAccountEmail } from "@/lib/mailer";
import { generateLogicartsId } from "@/lib/id-generator";

async function uniqueUsername(email: string, type: "CLIENT" | "AGENT") {
  const base = (email.split("@")[0] || type.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .slice(0, 35);

  let username = `${base}_${type.toLowerCase()}`;

  let number = 1;

  while (
    await prisma.user.findUnique({
      where: { username },
    })
  ) {
    username = `${base}_${type.toLowerCase()}_${number++}`.slice(0, 50);
  }

  return username;
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function requiredText(value: unknown, label: string) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new Error(`${label} is required.`);
  }

  return text;
}

function commercialDate(value: unknown, endOfDay = false) {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  const date = new Date(
    `${text}T${endOfDay ? "23:59:59.999" : "00:00:00"}+05:30`,
  );

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid commercial effective date.");
  }

  return date;
}

function validateClientCommercial(details: Record<string, any>) {
  const billingType = String(details.billingType || "PREPAID_WALLET");

  if (
    !["PREPAID_WALLET", "CREDIT_ACCOUNT", "PAY_PER_BOOKING"].includes(
      billingType,
    )
  ) {
    throw new Error("Invalid client billing model.");
  }

  const effectiveFrom = commercialDate(details.rateEffectiveFrom);

  if (!effectiveFrom) {
    throw new Error("Rate effective from date is required.");
  }

  const effectiveUntil = commercialDate(details.rateEffectiveUntil, true);

  if (effectiveUntil && effectiveUntil < effectiveFrom) {
    throw new Error("Rate effective until cannot be before effective from.");
  }

  if (!Array.isArray(details.rateRoutes) || details.rateRoutes.length === 0) {
    throw new Error("At least one client rate route is required.");
  }

  const nonNegative = (value: unknown, label: string) => {
    const amount = numberValue(value);

    if (amount < 0) {
      throw new Error(`${label} cannot be negative.`);
    }

    return amount;
  };

  const seenRoutes = new Set<string>();

  const routes = details.rateRoutes.map((route: any, routeIndex: number) => {
    const routeNumber = routeIndex + 1;

    const origin = requiredText(
      route.origin,
      `Rate origin for route ${routeNumber}`,
    ).toUpperCase();

    const destination = requiredText(
      route.destination,
      `Rate destination for route ${routeNumber}`,
    ).toUpperCase();

    const serviceType = requiredText(
      route.serviceType,
      `Rate service type for route ${routeNumber}`,
    );

    if (origin === destination) {
      throw new Error(
        `Origin and destination cannot be the same for route ${routeNumber}.`,
      );
    }

    const routeKey = [
      origin,
      destination,
      serviceType.trim().toUpperCase(),
    ].join("|");

    if (seenRoutes.has(routeKey)) {
      throw new Error(
        `Duplicate client rate route: ${origin} → ${destination} (${serviceType}).`,
      );
    }

    seenRoutes.add(routeKey);

    if (!Array.isArray(route.slabs) || route.slabs.length === 0) {
      throw new Error(
        `At least one weight slab is required for route ${routeNumber}.`,
      );
    }

    const slabs = route.slabs
      .map((slab: any, slabIndex: number) => {
        const minWeight = Number(slab.minWeight);

        const maxText = String(slab.maxWeight ?? "").trim();

        const maxWeight = maxText === "" ? null : Number(maxText);

        const ratePerKg = Number(slab.ratePerKg);

        if (!Number.isFinite(minWeight) || minWeight < 0) {
          throw new Error(
            `Invalid minimum weight in route ${routeNumber}, slab ${
              slabIndex + 1
            }.`,
          );
        }

        if (
          maxWeight !== null &&
          (!Number.isFinite(maxWeight) || maxWeight < minWeight)
        ) {
          throw new Error(
            `Invalid maximum weight in route ${routeNumber}, slab ${
              slabIndex + 1
            }.`,
          );
        }

        if (!Number.isFinite(ratePerKg) || ratePerKg <= 0) {
          throw new Error(
            `Invalid rate per kg in route ${routeNumber}, slab ${
              slabIndex + 1
            }.`,
          );
        }

        return {
          minWeight,
          maxWeight,
          ratePerKg,
        };
      })
      .sort((a: any, b: any) => a.minWeight - b.minWeight);

    for (let slabIndex = 0; slabIndex < slabs.length; slabIndex += 1) {
      const current = slabs[slabIndex];
      const next = slabs[slabIndex + 1];

      if (current.maxWeight === null && next) {
        throw new Error(
          `An open-ended rate slab must be the final slab for route ${routeNumber}.`,
        );
      }

      if (
        next &&
        current.maxWeight !== null &&
        next.minWeight <= current.maxWeight
      ) {
        throw new Error(
          `Weight slabs cannot overlap for route ${routeNumber}.`,
        );
      }
    }

    return {
      origin,
      destination,
      serviceType,

      minimumFreight: nonNegative(
        route.minimumFreight,
        `Minimum freight for route ${routeNumber}`,
      ),

      awbCharge: nonNegative(
        route.awbCharge,
        `AWB charge for route ${routeNumber}`,
      ),

      handlingCharge: nonNegative(
        route.handlingCharge,
        `Handling charge for route ${routeNumber}`,
      ),

      pickupCharge: nonNegative(
        route.pickupCharge,
        `Pickup charge for route ${routeNumber}`,
      ),

      deliveryCharge: nonNegative(
        route.deliveryCharge,
        `Delivery charge for route ${routeNumber}`,
      ),

      fuelSurchargePct: nonNegative(
        route.fuelSurchargePct,
        `Fuel surcharge for route ${routeNumber}`,
      ),

      gstPct: nonNegative(route.gstPct ?? 18, `GST for route ${routeNumber}`),

      slabs,
    };
  });

  const openingBalance = numberValue(details.openingBalance);

  if (openingBalance < 0) {
    throw new Error("Opening wallet balance cannot be negative.");
  }

  return {
    billingType,
    effectiveFrom,
    effectiveUntil,
    routes,
    openingBalance,

    paymentMode: String(details.paymentMode || "").trim(),

    paymentReference: String(details.paymentReference || "").trim(),

    paymentDate: String(details.paymentDate || "").trim(),
  };
}

async function activate(requestId: string) {
  const record = await prisma.onboardingRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!record) {
    return null;
  }

  if (
    record.status !== "PENDING" ||
    record.financeStatus !== "APPROVED" ||
    record.mdStatus !== "APPROVED"
  ) {
    return null;
  }

  const details = record.details as Record<string, any>;

  const type = record.type as "CLIENT" | "AGENT";

  const email = String(details.email || "")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Email is required for activation.");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("A user already exists with this email.");
  }

  const username = await uniqueUsername(email, type);

  const temporaryPassword = randomBytes(9).toString("base64url");

  const passwordHash = await hashPassword(temporaryPassword);

  /*
   * Generate external codes before
   * entering the transaction because
   * the existing ID helper uses the
   * global Prisma client.
   */
  const entityCode = await generateLogicartsId(
    type === "CLIENT" ? "LGCL" : "LGAG",
  );

  const commercial =
    type === "CLIENT" ? validateClientCommercial(details) : null;

  const result = await prisma.$transaction(async (tx) => {
    /*
     * Claim this pending request.
     * If two approval calls race,
     * only one transaction may
     * activate the account.
     */
    const claimed = await tx.onboardingRequest.updateMany({
      where: {
        id: requestId,
        status: "PENDING",
        financeStatus: "APPROVED",
        mdStatus: "APPROVED",
      },

      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    if (claimed.count !== 1) {
      return null;
    }

    let clientId: string | null = null;

    let agentId: string | null = null;

    if (type === "CLIENT") {
      if (!commercial) {
        throw new Error("Client commercial setup is required.");
      }

      const client = await tx.client.create({
        data: {
          code: entityCode,

          companyName: String(details.companyName),

          billingType: commercial.billingType as any,

          gstNumber: details.gstin || null,

          contactPerson: details.contactPerson || null,

          designation: details.designation || null,

          phone: details.phone || null,

          email,

          address: details.address || null,

          city: details.city || null,

          state: details.state || null,

          origin: details.origin || null,

          destination: details.destination || null,

          serviceType: details.serviceType || null,

          shipmentFrequency: details.shipmentFrequency || null,
        },
      });

      clientId = client.id;

      const rateContract = await tx.clientRateContract.create({
        data: {
          clientId: client.id,

          version: 1,

          name: "Initial Contract",

          effectiveFrom: commercial.effectiveFrom,

          effectiveUntil: commercial.effectiveUntil,

          status: "ACTIVE",
        },
      });

      for (const route of commercial.routes) {
        const rateRoute = await tx.clientRateRoute.create({
          data: {
            rateContractId: rateContract.id,

            origin: route.origin,
            destination: route.destination,
            serviceType: route.serviceType,

            minimumFreight: route.minimumFreight,
            awbCharge: route.awbCharge,
            handlingCharge: route.handlingCharge,
            pickupCharge: route.pickupCharge,
            deliveryCharge: route.deliveryCharge,
            fuelSurchargePct: route.fuelSurchargePct,
            gstPct: route.gstPct,
          },
        });

        await tx.clientRateSlab.createMany({
          data: route.slabs.map((slab: any) => ({
            rateRouteId: rateRoute.id,
            minWeight: slab.minWeight,
            maxWeight: slab.maxWeight,
            ratePerKg: slab.ratePerKg,
          })),
        });
      }

      const wallet = await tx.clientWallet.create({
        data: {
          clientId: client.id,

          balance: commercial.openingBalance,
        },
      });

      if (commercial.openingBalance > 0) {
        const remarks = [
          "Opening wallet balance",
          commercial.paymentMode ? `Mode: ${commercial.paymentMode}` : null,
          commercial.paymentDate
            ? `Payment date: ${commercial.paymentDate}`
            : null,
        ]
          .filter(Boolean)
          .join(" | ");

        await tx.clientWalletTransaction.create({
          data: {
            walletId: wallet.id,

            clientId: client.id,

            type: "CREDIT",

            amount: commercial.openingBalance,

            balanceBefore: 0,

            balanceAfter: commercial.openingBalance,

            reference: commercial.paymentReference || null,

            remarks,

            createdByUserId: record.createdByUserId || null,
          },
        });
      }
    } else {
      const agent = await tx.agent.create({
        data: {
          code: entityCode,

          companyName: String(details.companyName),

          agentType: details.agentType || "LOGISTICS_COMPANY",

          gstNumber: details.gstin || null,

          contactPerson: details.contactPerson || null,

          designation: details.designation || null,

          phone: details.phone || null,

          email,

          address: details.address || null,

          city: details.city || null,

          airport: details.airport || details.origin || null,

          destination: details.destination || null,

          serviceType: details.serviceType || null,

          shipmentFrequency: details.shipmentFrequency || null,
        },
      });

      agentId = agent.id;
    }

    await tx.user.create({
      data: {
        username,
        passwordHash,

        fullName: details.contactPerson || details.companyName,

        email,

        phone: details.phone || null,

        role: type,

        clientId,
        agentId,
      },
    });

    return {
      username,
    };
  });

  if (!result) {
    return null;
  }

  /*
   * Email is deliberately outside the
   * DB transaction. A mail failure must
   * not roll back financial/account data.
   */
  try {
    await sendAccountEmail({
      email,

      name: details.contactPerson || details.companyName,

      username,
      temporaryPassword,
      type,
    });
  } catch (error) {
    console.error("Account created but onboarding email failed:", error);
  }

  return result;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      {
        error: "Approval token required.",
      },
      { status: 400 },
    );
  }

  const record = await prisma.onboardingRequest.findFirst({
    where: {
      OR: [{ financeToken: token }, { mdToken: token }],
    },
  });

  if (!record) {
    return NextResponse.json(
      {
        error: "Invalid approval token.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    requestNumber: record.requestNumber,

    type: record.type,

    status: record.status,

    financeStatus: record.financeStatus,

    mdStatus: record.mdStatus,

    details: record.details,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token = String(body.token || "");

    const decision = String(body.decision || "").toUpperCase();

    const reason = body.reason ? String(body.reason) : null;

    if (!token || !["APPROVE", "REJECT"].includes(decision)) {
      return NextResponse.json(
        {
          error: "Token and decision are required.",
        },
        { status: 400 },
      );
    }

    const record = await prisma.onboardingRequest.findFirst({
      where: {
        OR: [
          {
            financeToken: token,
          },
          {
            mdToken: token,
          },
        ],
      },
    });

    if (!record) {
      return NextResponse.json(
        {
          error: "Invalid approval token.",
        },
        { status: 404 },
      );
    }

    if (record.status !== "PENDING") {
      return NextResponse.json(
        {
          error: `Request is already ${record.status.toLowerCase()}.`,
        },
        { status: 409 },
      );
    }

    const finance = record.financeToken === token;

    if (decision === "REJECT") {
      await prisma.onboardingRequest.update({
        where: {
          id: record.id,
        },

        data: {
          status: "REJECTED",

          financeStatus: finance ? "REJECTED" : record.financeStatus,

          mdStatus: !finance ? "REJECTED" : record.mdStatus,

          rejectionReason: reason,

          rejectedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        status: "REJECTED",
      });
    }

    await prisma.onboardingRequest.update({
      where: {
        id: record.id,
      },

      data: finance
        ? {
            financeStatus: "APPROVED",
          }
        : {
            mdStatus: "APPROVED",
          },
    });

    const result = await activate(record.id);

    const latest = await prisma.onboardingRequest.findUnique({
      where: {
        id: record.id,
      },
    });

    return NextResponse.json({
      success: true,

      status: latest?.status,

      financeStatus: latest?.financeStatus,

      mdStatus: latest?.mdStatus,

      accountCreated: Boolean(result),

      username: result?.username,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message || "Unable to process approval.",
      },
      { status: 500 },
    );
  }
}
