import bcrypt from "bcryptjs";
import { prisma } from "../src/shared/prisma";
import { SALT_ROUNDS } from "../src/shared/constants";

const USERNAME = "admin";
const PASSWORD = "admin1";

async function main() {
  const user = await prisma.user.upsert({
    where: { username: USERNAME },
    update: {},
    create: { username: USERNAME, password: await bcrypt.hash(PASSWORD, SALT_ROUNDS) },
    select: { id: true, username: true },
  });

  console.log(`Seed tayyor: ${user.username} (${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
