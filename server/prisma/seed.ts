import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { User, Task } from "@prisma/client";

const prisma = new PrismaClient();

type UserSeedData = Omit<User, 'id' | 'createdAt'>
type TaskSeedData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

async function main(): Promise<void> {
  // Засидка пользователей
  console.log('🌱 Seeding users to database...');

  const userLength = await prisma.user.findMany();

  if (userLength.length > 0) {
    throw new Error('User table is not empty')
  }

  const users: UserSeedData[] = [];

  for (let i = 0; i < 10; i++) {
    const passwordHash: string = await bcrypt.hash('Qwerty1!', 10);
    const email: string = `email${i}@gmail.com`

    users.push({
      email,
      password: passwordHash,
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log('✅ Users seeded:', users.length);

  // Засидка задач
  console.log('🌱 Seeding tasks to database...');

  const taskLength = await prisma.task.findMany();

  if (taskLength.length > 0) {
    throw new Error('Task table is not empty')
  }

  const allUsers = await prisma.user.findMany();

  const tasks: TaskSeedData[] = [];

  for (let i = 0; i < 30; i++) {
    const author = allUsers[Math.floor(Math.random() * allUsers.length)];
    let executor = allUsers[Math.floor(Math.random() * allUsers.length)];

    while (executor.id === author.id) {
      executor = allUsers[Math.floor(Math.random() * allUsers.length)];
    }

    tasks.push({
      title: `Название задачи ${i}`,
      description: `Это описание для задачи ${i}`,
      authorId: author.id,
      executorId: executor.id,
    });
  }

  await prisma.task.createMany({
    data: tasks,
  });

  console.log('✅ Tasks seeded:', tasks.length);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
