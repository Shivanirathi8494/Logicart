import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { deleteSessionCookie, getSessionCookie } from "@/lib/auth/cookies";

export async function POST() {

  const token = await getSessionCookie();

  if (token) {

    await prisma.session.deleteMany({
      where: {
        token,
      },
    });

  }

  await deleteSessionCookie();

  return NextResponse.json({
    success: true,
  });

}
