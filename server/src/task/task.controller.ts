import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ParamTaskDto } from './dto/param-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  // Получение задач пользователя (созданных им и назначенных ему)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async findUsersTasks(@Req() req: Request) {
    const user = req.user;
    return this.taskService.findUserTasks(user);
  }

  // Создание задачи
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    const user = req.user;
    return this.taskService.create(user, dto);
  }

  // Обновление задачи
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() req: Request, @Body() dto: UpdateTaskDto, @Param() param: ParamTaskDto) {
    const user = req.user;
    const id = param.id
    return this.taskService.update(id, user, dto);
  }

  // Удаление задачи
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() req: Request, @Param() param: ParamTaskDto) {
    const user = req.user;
    const id = param.id
    return this.taskService.delete(id, user);
  }
}
