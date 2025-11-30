import { User } from "@prisma/client";

// Выбирает случайного исполнителя из списка пользователей и возвращает его ID
export default function getRandomExecutor(users: User[]): string {
  const randomIndex = Math.floor(Math.random() * users.length);
  const { id } = users[randomIndex];
  return id;
}