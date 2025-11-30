import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function destroy(): Promise<void> {
  console.log('🧨 Destroying database...');

  await prisma.user.deleteMany();
  await prisma.task.deleteMany();

  console.log('✅ Database destroyed');
}

destroy()
  .catch((e) => {
    console.error('❌ Destroy error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });  