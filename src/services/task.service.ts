import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignTaskDto, UpdateTaskDto } from 'src/dtos/task.dto';
import { Member } from 'src/entities/member.entity';
import { Task } from 'src/entities/task.entity';
import { TaskStatus } from 'src/enums/data.enum';
import { Repository } from 'typeorm';

interface TaskDetails {
  description: string;
  dueDate: Date;
  status: TaskStatus;
}


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  //Create new Task
  async createTask(taskDetails: TaskDetails) {
    const newTask: Task = this.taskRepository.create(taskDetails);
    return await this.taskRepository.save(newTask);
  }

  //Assign a task to one member
  async assignTaskToMember(assignmentDetails: AssignTaskDto) {
    const { taskId, memberId } = assignmentDetails;

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new BadRequestException('Task does not exist');
    }

    const member = await this.memberRepository.findOne({
      where: { id: memberId },
    });
    if (!member) {
      throw new BadRequestException('Member does not exist');
    }

    task.member = member;

    return await this.taskRepository.save(task);
  }

  async getTaskWithAssignee() {
    return this.taskRepository.find({ relations: { member: true } });
  }

  async updateTask(id: number, updateTaskDetails: UpdateTaskDto) {
    const updated = await this.taskRepository.update(id, updateTaskDetails);

    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new BadRequestException('Invalid Task Id');
    }

    return task;
  }
}
