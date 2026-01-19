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
    return this.tasks.filter((t) => {
      let match = true;

      if (
        params.title != undefined &&
        t.title.toLowerCase() != params.title.toLowerCase()
      ) {
        match = false;
      }

      if (params.status != undefined && t.status != params.status) {
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
