import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@aiclex.in";
  const password = await bcrypt.hash("Aiclex123", 10);
  
  await prisma.user.upsert({
    where: { email },
    update: { password, role: "ADMIN", name: "AICLEX Admin" },
    create: { email, password, role: "ADMIN", name: "AICLEX Admin" }
  });
  
  console.log("Seeded Admin: admin@aiclex.in");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // @ts-ignore
    if (prisma.$disconnect) {
      // @ts-ignore
      await prisma.$disconnect();
    }
  });
