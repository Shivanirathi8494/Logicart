import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getSessionCookie } from "@/lib/auth/cookies";

export async function getCurrentUser() {
  const token = await getSessionCookie();

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          branch: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  const now = new Date();

  /*
   * Sliding inactivity timeout:
   *
   * If the operator has made no authenticated
   * request for 30 minutes, the session expires.
   */
  if (session.expiresAt <= now) {
    await prisma.session.deleteMany({
      where: {
        token,
      },
    });

    return null;
  }

  if (session.user.status !== "ACTIVE") {
    return null;
  }

  /*
   * Active operator:
   * extend the session another 30 minutes.
   */
  const nextExpiry =
    new Date(
      now.getTime() +
        30 * 60 * 1000
    );

  await prisma.session.update({
    where: {
      token,
    },

    data: {
      lastSeen: now,
      expiresAt: nextExpiry,
    },
  });

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(["ADMIN"]);
}

/**
 * Returns the branch code assigned to an employee.
 *
 * Example:
 * user.branchId -> Branch(code = "BLR")
 * returns "BLR"
 */
export function getUserBranchCode(
  user: Awaited<ReturnType<typeof requireUser>>
) {
  return user.branch?.code?.trim().toUpperCase() ?? null;
}

/**
 * Determines how a branch employee participates
 * in a particular shipment.
 */
export function getShipmentWorkingSide(
  branchCode: string,
  shipment: {
    origin: string;
    destination: string;
  }
): "ORIGIN" | "DESTINATION" | "BOTH" | "NONE" {

  const branch = branchCode.trim().toUpperCase();
  const origin = shipment.origin.trim().toUpperCase();
  const destination = shipment.destination.trim().toUpperCase();

  const isOrigin = branch === origin;
  const isDestination = branch === destination;

  if (isOrigin && isDestination) {
    return "BOTH";
  }

  if (isOrigin) {
    return "ORIGIN";
  }

  if (isDestination) {
    return "DESTINATION";
  }

  return "NONE";
}
