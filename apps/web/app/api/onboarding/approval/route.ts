import {
  randomBytes,
} from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { sendAccountEmail } from "@/lib/mailer";
import { generateLogicartsId } from "@/lib/id-generator";

async function uniqueUsername(
  email: string,
  type: "CLIENT" | "AGENT"
) {
  const base =
    (
      email.split("@")[0] ||
      type.toLowerCase()
    )
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .slice(0, 35);

  let username =
    `${base}_${type.toLowerCase()}`;

  let number = 1;

  while (
    await prisma.user.findUnique({
      where: { username },
    })
  ) {
    username =
      `${base}_${type.toLowerCase()}_${number++}`.slice(
        0,
        50
      );
  }

  return username;
}

async function activate(
  requestId: string
) {
  const record =
    await prisma.onboardingRequest.findUnique({
      where: {
        id: requestId,
      },
    });

  if (!record) {
    return null;
  }

  if (
    record.status !== "PENDING" ||
    record.financeStatus !==
      "APPROVED" ||
    record.mdStatus !== "APPROVED"
  ) {
    return null;
  }

  const details =
    record.details as Record<
      string,
      any
    >;

  const type =
    record.type as
      | "CLIENT"
      | "AGENT";

  const email = String(
    details.email || ""
  )
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error(
      "Email is required for activation."
    );
  }

  const existing =
    await prisma.user.findUnique({
      where: { email },
    });

  if (existing) {
    throw new Error(
      "A user already exists with this email."
    );
  }

  const username =
    await uniqueUsername(
      email,
      type
    );

  const temporaryPassword =
    randomBytes(9).toString(
      "base64url"
    );

  const passwordHash =
    await hashPassword(
      temporaryPassword
    );

  let clientId: string | null =
    null;

  let agentId: string | null =
    null;

  if (type === "CLIENT") {
    const client =
      await prisma.client.create({
        data: {
          code:
            await generateLogicartsId("LGCL"),

          companyName:
            String(
              details.companyName
            ),

          gstNumber:
            details.gstin || null,

          contactPerson:
            details.contactPerson ||
            null,

          designation:
            details.designation ||
            null,

          phone:
            details.phone || null,

          email,

          address:
            details.address || null,

          city:
            details.city || null,

          state:
            details.state || null,

          origin:
            details.origin || null,

          destination:
            details.destination ||
            null,

          serviceType:
            details.serviceType ||
            null,

          shipmentFrequency:
            details.shipmentFrequency ||
            null,
        },
      });

    clientId = client.id;
  } else {
    const agent =
      await prisma.agent.create({
        data: {
          code:
            await generateLogicartsId("LGAG"),

          companyName:
            String(
              details.companyName
            ),

          agentType:
            details.agentType ||
            "LOGISTICS_COMPANY",

          gstNumber:
            details.gstin || null,

          contactPerson:
            details.contactPerson ||
            null,

          designation:
            details.designation ||
            null,

          phone:
            details.phone || null,

          email,

          address:
            details.address || null,

          city:
            details.city || null,

          airport:
            details.airport ||
            details.origin ||
            null,

          destination:
            details.destination ||
            null,

          serviceType:
            details.serviceType ||
            null,

          shipmentFrequency:
            details.shipmentFrequency ||
            null,
        },
      });

    agentId = agent.id;
  }

  await prisma.user.create({
    data: {
      username,
      passwordHash,

      fullName:
        details.contactPerson ||
        details.companyName,

      email,

      phone:
        details.phone || null,

      role: type,

      clientId,
      agentId,
    },
  });

  await prisma.onboardingRequest.update({
    where: {
      id: requestId,
    },

    data: {
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  await sendAccountEmail({
    email,

    name:
      details.contactPerson ||
      details.companyName,

    username,
    temporaryPassword,
    type,
  });

  return {
    username,
  };
}

export async function GET(
  request: NextRequest
) {
  const token =
    request.nextUrl.searchParams.get(
      "token"
    );

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Approval token required.",
      },
      { status: 400 }
    );
  }

  const record =
    await prisma.onboardingRequest.findFirst({
      where: {
        OR: [
          { financeToken: token },
          { mdToken: token },
        ],
      },
    });

  if (!record) {
    return NextResponse.json(
      {
        error:
          "Invalid approval token.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    requestNumber:
      record.requestNumber,

    type:
      record.type,

    status:
      record.status,

    financeStatus:
      record.financeStatus,

    mdStatus:
      record.mdStatus,

    details:
      record.details,
  });
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const token =
      String(body.token || "");

    const decision =
      String(
        body.decision || ""
      ).toUpperCase();

    const reason =
      body.reason
        ? String(body.reason)
        : null;

    if (
      !token ||
      ![
        "APPROVE",
        "REJECT",
      ].includes(decision)
    ) {
      return NextResponse.json(
        {
          error:
            "Token and decision are required.",
        },
        { status: 400 }
      );
    }

    const record =
      await prisma.onboardingRequest.findFirst({
        where: {
          OR: [
            {
              financeToken:
                token,
            },
            {
              mdToken:
                token,
            },
          ],
        },
      });

    if (!record) {
      return NextResponse.json(
        {
          error:
            "Invalid approval token.",
        },
        { status: 404 }
      );
    }

    if (
      record.status !== "PENDING"
    ) {
      return NextResponse.json(
        {
          error:
            `Request is already ${record.status.toLowerCase()}.`,
        },
        { status: 409 }
      );
    }

    const finance =
      record.financeToken ===
      token;

    if (
      decision === "REJECT"
    ) {
      await prisma.onboardingRequest.update({
        where: {
          id: record.id,
        },

        data: {
          status: "REJECTED",

          financeStatus:
            finance
              ? "REJECTED"
              : record.financeStatus,

          mdStatus:
            !finance
              ? "REJECTED"
              : record.mdStatus,

          rejectionReason:
            reason,

          rejectedAt:
            new Date(),
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
            financeStatus:
              "APPROVED",
          }
        : {
            mdStatus:
              "APPROVED",
          },
    });

    const result =
      await activate(
        record.id
      );

    const latest =
      await prisma.onboardingRequest.findUnique({
        where: {
          id: record.id,
        },
      });

    return NextResponse.json({
      success: true,

      status:
        latest?.status,

      financeStatus:
        latest?.financeStatus,

      mdStatus:
        latest?.mdStatus,

      accountCreated:
        Boolean(result),

      username:
        result?.username,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to process approval.",
      },
      { status: 500 }
    );
  }
}
