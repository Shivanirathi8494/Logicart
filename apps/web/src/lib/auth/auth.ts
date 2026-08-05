import { prisma } from "@/lib/prisma";

import { verifyPassword } from "./password";
import { generateSessionToken, sessionExpiryDate } from "./session";

export async function authenticate(
  username: string,
  password: string,
) {

  console.log("========== AUTH DEBUG ==========");
  console.log("prisma =", prisma);
  console.log("prisma.user =", prisma.user);
  console.log("keys =", Object.keys(prisma));
  console.log("================================");

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  const valid = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!valid) {
    return null;
  }

  const token = generateSessionToken();

  const session = await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: sessionExpiryDate(),
    },
  });

  return {
    user,
    session,
  };

}
