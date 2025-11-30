import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import getRandomExecutor from 'src/utils/getRandomExecutor';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';


@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) { }

  // Получение задач пользователя (созданных им и назначенных ему)
  async findUserTasks(user): Promise<Task[]> {
    const userId = user.id as string;

    const tasks = await this.prismaService.task.findMany({
      where: {
        OR: [
          { authorId: userId },
          { executorId: userId }
        ],
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return tasks;
  }

  // Создание задачи
  async create(user, dto: CreateTaskDto): Promise<Task> {
    const userId = user.id as string;
    const { title, description } = dto;

    const users = await this.prismaService.user.findMany({
      where: { id: { not: userId } }
    });

    const executorId = getRandomExecutor(users);

    const task = await this.prismaService.task.create({
      data: {
        title,
        description,
        authorId: userId,
        executorId,
      },
    })

    return task;
  }

  // Обновление задачи
  async update(id: string, user, dto: UpdateTaskDto): Promise<Task> {
    const userId = user.id as string;
    const { title, description } = dto;

    const existTask = await this.prismaService.task.findUnique({
      where: { id }
    })

    if (!existTask) {
      throw new NotFoundException('Задача не найдена');
    }

    if (existTask.authorId !== userId) {
      throw new ForbiddenException('У вас нет прав на изменение этой задачи');
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: {
        title,
        description,
      },
    })

    return updatedTask;
  }

  // Удаление задачи
  async delete(id: string, user): Promise<{ isDelete: boolean; message: string }> {
    const userId = user.id;
    const existTask = await this.prismaService.task.findUnique({
      where: { id }
    })

    if (!existTask) {
      throw new NotFoundException('Задача не найдена');
    }
    
    if (existTask.authorId !== userId) {
      throw new ForbiddenException('У вас нет прав на удаление этой задачи');
    }

    await this.prismaService.task.delete({ where: { id } });

    return { isDelete: true, message: `Задача "${existTask.title}" успешно удалена` };
  }
}