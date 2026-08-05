import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionCookie } from "@/lib/auth/cookies";

export async function GET() {

  const token = await getSessionCookie();

  if (!token) {

    return NextResponse.json(null);

  }

  const session = await prisma.session.findUnique({

    where: {
      token,
    },

    include: {
      user: true,
    },

  });

  if (!session) {

    return NextResponse.json(null);

  }

  return NextResponse.json({

    id: session.user.id,
    username: session.user.username,
    fullName: session.user.fullName,
    role: session.user.role,

  });

}
