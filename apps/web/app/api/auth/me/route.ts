import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/authorization";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    clientId: user.clientId,
    agentId: user.agentId,
    branchId: user.branchId,
  });
}
