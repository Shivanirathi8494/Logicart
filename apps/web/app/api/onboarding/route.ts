import {
  randomBytes,
  randomUUID,
} from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/authorization";
import { sendApprovalEmails } from "@/lib/mailer";
import { generateLogicartsId } from "@/lib/id-generator";

function requestNumber() {
  const day = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");

  return (
    "LGT-" +
    day +
    "-" +
    randomBytes(3)
      .toString("hex")
      .toUpperCase()
  );
}

async function uniqueUsername(
  requested: string
) {
  const clean =
    requested
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .slice(0, 40) ||
    "logicarts";

  let username = clean;
  let number = 1;

  while (
    await prisma.user.findUnique({
      where: { username },
    })
  ) {
    username =
      `${clean}_${number++}`.slice(
        0,
        50
      );
  }

  return username;
}

export async function POST(
  request: NextRequest
) {
  try {
    const admin = await requireAdmin();

    const body = await request.json();

    const type = String(
      body.type || ""
    ).toUpperCase();

    const details = body.details || {};

    if (
      ![
        "CLIENT",
        "AGENT",
        "CUSTOMER",
        "EMPLOYEE",
      ].includes(type)
    ) {
      return NextResponse.json(
        { error: "Invalid type." },
        { status: 400 }
      );
    }

    if (type === "CUSTOMER") {
      if (!details.companyName) {
        return NextResponse.json(
          {
            error:
              "Company name is required.",
          },
          { status: 400 }
        );
      }

      const customer =
        await prisma.customer.create({
          data: {
            code:
              await generateLogicartsId("LGCU"),

            name: details.companyName,
            contactPerson:
              details.contactPerson ||
              null,

            phone:
              details.phone || null,

            email:
              details.email || null,

            address:
              details.address || null,

            city:
              details.city || null,

            state:
              details.state || null,

            gstNumber:
              details.gstin || null,

            panNumber:
              details.pan || null,
          },
        });

      return NextResponse.json({
        success: true,
        customer,
      });
    }

    if (type === "EMPLOYEE") {
      if (!details.name) {
        return NextResponse.json(
          {
            error:
              "Employee name is required.",
          },
          { status: 400 }
        );
      }

      const username =
        await uniqueUsername(
          details.username ||
            details.email ||
            details.name
        );

      const temporaryPassword =
        randomBytes(9).toString(
          "base64url"
        );

      const user =
        await prisma.user.create({
          data: {
            username,

            passwordHash:
              await hashPassword(
                temporaryPassword
              ),

            fullName: details.name,

            email:
              details.email || null,

            phone:
              details.phone || null,

            role: "EMPLOYEE",

            employeeProfile: {
              create: {
                employeeCode:
                  await generateLogicartsId("LGEM"),

                city:
                  details.city || null,

                airport:
                  details.airport || null,

                destination:
                  details.destination ||
                  null,
              },
            },
          },
        });

      return NextResponse.json({
        success: true,
        userId: user.id,
        username,
        temporaryPassword,
      });
    }

    if (
      !details.companyName ||
      !details.email
    ) {
      return NextResponse.json(
        {
          error:
            "Company name and email are required.",
        },
        { status: 400 }
      );
    }

    const financeToken =
      randomUUID();

    const mdToken =
      randomUUID();

    const number =
      await generateLogicartsId("LGRQ");

    await prisma.onboardingRequest.create({
      data: {
        requestNumber: number,
        type: type as
          | "CLIENT"
          | "AGENT",

        details,

        financeToken,
        mdToken,

        createdByUserId: admin.id,
      },
    });

    const emailSent =
      await sendApprovalEmails({
        requestNumber: number,

        type: type as
          | "CLIENT"
          | "AGENT",

        details,

        financeToken,
        mdToken,
      });

    return NextResponse.json({
      success: true,
      requestNumber: number,
      status: "PENDING",
      emailSent,
    });
  } catch (error: any) {
    if (
      error?.message ===
        "UNAUTHORIZED" ||
      error?.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to create onboarding request.",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await requireAdmin();

    const requests =
      await prisma.onboardingRequest.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      });

    return NextResponse.json(
      requests.map((request) => {
        const details =
          request.details as Record<string, unknown>;

        return {
          id: request.id,
          requestNumber: request.requestNumber,
          type: request.type,
          companyName:
            String(details.companyName || ""),
          contactPerson:
            String(details.contactPerson || ""),
          status: request.status,
          financeStatus:
            request.financeStatus,
          mdStatus:
            request.mdStatus,
          createdAt:
            request.createdAt,
        };
      })
    );
  } catch (error: any) {
    if (
      error?.message === "UNAUTHORIZED" ||
      error?.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Unable to load onboarding requests.",
      },
      { status: 500 }
    );
  }
}
