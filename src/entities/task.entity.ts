import { TaskStatus } from 'src/enums/data.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enumName: 'task_status',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: string;

  @ManyToOne(() => Member, (member) => member.task)
  member: Member;

}
