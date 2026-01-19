/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAllParameters, TaskDto } from './dto/task.dto';
import { randomUUID } from 'crypto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: TaskDto[] = [];

  create(task: Omit<TaskDto, 'id'>): TaskDto {
    const newTask: TaskDto = {
      id: randomUUID(),
      ...task,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  findAll(params: FindAllParameters): TaskDto[] {
    console.log('PARAMS:', params);

    return this.tasks.filter((t) => {
      let match = true;

      const titleParam = Array.isArray(params.title)
        ? params.title[0]
        : params.title;

      const statusParam = Array.isArray(params.status)
        ? params.status[0]
        : params.status;

      const title = titleParam?.toLowerCase().trim();
      const status = statusParam?.toLowerCase().trim();

      if (title && !t.title.toLowerCase().includes(title)) {
        match = false;
      }

      if (status && !t.status?.toLowerCase().includes(status)) {
        match = false;
      }
      return match;
    });
  }

  findById(id: string): TaskDto {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    return task;
  }

  update(id: string, data: UpdateTaskDto): TaskDto {
    const task = this.findById(id);

    Object.assign(task, data);

    return task;
  }

  remove(id: string) {
    const task = this.tasks.findIndex((t) => t.id === id);

    if (task === -1) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const [removedTask] = this.tasks.splice(task, 1);
    return removedTask;
  }
}
