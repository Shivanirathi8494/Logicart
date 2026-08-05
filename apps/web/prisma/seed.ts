import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("Seeding Logicarts LMS...");

  /*
   * Company Settings
   */
  const settings = await prisma.companySettings.findFirst();

  if (!settings) {

    await prisma.companySettings.create({

      data: {

        companyName: "Logicarts",

        tagline: "Always On Time",

        website: "https://logicarts.in",

        phone: "+91 98765 43210",

        email: "info@logicarts.in",

        address: "Bengaluru, Karnataka, India",

        linkedin:
          "https://www.linkedin.com/company/logicarts/",

        facebook:
          "https://facebook.com/logicarts.in",

        instagram:
          "https://instagram.com/logicartslogistics",

        youtube:
          "https://www.youtube.com/@logicarts3988",

        supportText:
          "24×7 Customer Support",

      },

    });

    console.log("✓ Company Settings created");

  }

  /*
   * Branch
   */
  let branch = await prisma.branch.findUnique({

    where: {

      code: "HQ",

    },

  });

  if (!branch) {

    branch = await prisma.branch.create({

      data: {

        code: "HQ",

        name: "Head Office",

        address: "Bengaluru",

        phone: "+91 98765 43210",

        email: "info@logicarts.in",

      },

    });

    console.log("✓ Head Office created");

  }

  /*
   * Admin User
   */
  const admin = await prisma.user.findUnique({

    where: {

      username: "admin",

    },

  });

  if (!admin) {

    const passwordHash =
      await bcrypt.hash("Admin@123", 12);

    await prisma.user.create({

      data: {

        username: "admin",

        passwordHash,

        fullName: "System Administrator",

        email: "admin@logicarts.in",

        phone: "+91 98765 43210",

        role: "ADMIN",

        branchId: branch.id,

      },

    });

    console.log("✓ Admin User created");

  }

  /*
   * Demo Customers
   */
  const customerCount =
    await prisma.customer.count();

  if (customerCount === 0) {

    await prisma.customer.createMany({

      data: [

        {

          code: "CUST0001",

          name: "ABC Technologies",

          city: "Bangalore",

          state: "Karnataka",

          phone: "9999999991",

          email: "contact@abc.com",

        },

        {

          code: "CUST0002",

          name: "XYZ Industries",

          city: "Delhi",

          state: "Delhi",

          phone: "9999999992",

          email: "sales@xyz.com",

        },

        {

          code: "CUST0003",

          name: "Global Traders",

          city: "Mumbai",

          state: "Maharashtra",

          phone: "9999999993",

          email: "info@global.com",

        },

      ],

    });

    console.log("✓ Demo Customers created");

  }

  console.log("Logicarts seed completed.");

}

main()
  .catch(console.error)
  .finally(async () => {

    await prisma.$disconnect();

  });
