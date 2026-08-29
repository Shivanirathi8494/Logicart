import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth/authorization";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireRole(["CLIENT"]);

    if (!user.clientId) {
      return NextResponse.json(
        {
          error: "Your user account is not linked to a Client ID.",
        },
        { status: 400 },
      );
    }

    const [account, client] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user.id,
        },

        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          phone: true,
        },
      }),

      prisma.client.findUnique({
        where: {
          id: user.clientId,
        },

        select: {
          id: true,
          code: true,
          companyName: true,
          contactPerson: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          gstNumber: true,
          billingType: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    if (!account) {
      return NextResponse.json(
        {
          error: "User account was not found.",
        },
        { status: 404 },
      );
    }

    if (!client) {
      return NextResponse.json(
        {
          error: "Client account was not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: account,
      client,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    if (error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        { status: 403 },
      );
    }

    console.error("Client profile GET failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load client profile.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    /*
     * The authenticated session is the only source
     * of the user whose password may be changed.
     *
     * Never accept a userId from the browser.
     */
    const user = await requireRole(["CLIENT"]);

    const body = await request.json();

    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        {
          error: "Current password is required.",
        },
        { status: 400 },
      );
    }

    if (!newPassword) {
      return NextResponse.json(
        {
          error: "New password is required.",
        },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          error: "New password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          error: "New password and confirmation do not match.",
        },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          error: "New password must be different from your current password.",
        },
        { status: 400 },
      );
    }

    /*
     * Read the hash directly from the database.
     * It is never returned to the browser.
     */
    const account = await prisma.user.findUnique({
      where: {
        id: user.id,
      },

      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          error: "User account was not found.",
        },
        { status: 404 },
      );
    }

    const validCurrentPassword = await verifyPassword(
      currentPassword,
      account.passwordHash,
    );

    if (!validCurrentPassword) {
      return NextResponse.json(
        {
          error: "Current password is incorrect.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    if (error?.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error: "Access denied.",
        },
        { status: 403 },
      );
    }

    console.error("Client password change failed:", error);

    return NextResponse.json(
      {
        error: "Unable to change password.",
      },
      { status: 500 },
    );
  }
}
