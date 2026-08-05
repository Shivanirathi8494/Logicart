import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  let branch = await prisma.branch.findFirst({
    where: {
      code: "HQ",
    },
  });

  if (!branch) {

    branch = await prisma.branch.create({

      data: {
        code: "HQ",
        name: "Head Office",
        address: "Head Office",
        phone: "9999999999",
        email: "admin@logicarts.com",
      },

    });

  }

  const existing = await prisma.user.findUnique({
    where: {
      username: "admin",
    },
  });

  if (existing) {

    console.log("Admin already exists.");
    return;

  }

  const passwordHash = await bcrypt.hash("Admin@123", 12);

  await prisma.user.create({

    data: {

      username: "admin",

      passwordHash,

      fullName: "System Administrator",

      email: "admin@logicarts.com",

      phone: "9999999999",

      role: UserRole.ADMIN,

      branchId: branch.id,

    },

  });

  console.log("Admin user created successfully.");

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
