import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from 'src/dtos/task.dto';
import { Task } from 'src/entities/task.entity';
import { TaskStatus } from 'src/enums/data.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AddMemberDto, CreateTeamDto, MemberDto } from './dtos/team.dto';
import { Team } from './entities/team.entity';
import { Member } from './entities/member.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface TaskDetails {
  description: string;
  dueDate: Date;
  status: TaskStatus;
}

interface MemberDetails {
  name: string;
  email: string;
  teamId: Team;
}

interface Credentials{
  username:string;
  password:string;
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getToken() {
    const payload : Credentials = {
      username: this.configService.getOrThrow('TOKEN_USERNAME'),
      password: this.configService.getOrThrow('TOKEN_PASSWORD'),
    };
    // console.log(payload);
    return { token: this.jwtService.sign(payload) };
  }

  //Create new Task
  async createTask(taskDetails: TaskDetails) {
    const newTask: Task = this.taskRepository.create(taskDetails);
    return await this.taskRepository.save(newTask);
  }

  // Create new Team
  async createTeam(teamDetails: CreateTeamDto) {
    const team = await this.teamRepository.findOne({
      where: { name: teamDetails.name },
    });
    
    // Check team name already registered
    if (team) {
      throw new BadRequestException('Team Name Already Registered');
    }
    const newTeam: Team = this.teamRepository.create(teamDetails);
    return await this.teamRepository.save(newTeam);
  }

  // Create Team Member, Email should be unique
  async createMember(memberDetails: MemberDto) {
    const member = await this.memberRepository.findOne({
      where: { email: memberDetails.email },
    });
    if (member) {
      throw new BadRequestException('Email Already Registered');
    }
    const newMember: Member = this.memberRepository.create(memberDetails);
    return await this.memberRepository.save(newMember);
  }

  async getAllMember() {
    return await this.memberRepository.find();
  }

  // Add member to a team. If team not registered, creates a new team with given name
  async addMemberToTeam(memberDetails: AddMemberDto) {
    let team: Team;
    team = await this.teamRepository.findOne({
      where: { name: memberDetails.teamName },
    });
    console.log(team);
    if (!team) {
      const newTeam = this.teamRepository.create({
        name: memberDetails.teamName,
      });
      team = await this.teamRepository.save(newTeam);
    }
    console.log(memberDetails);

    // checks whether given team member are registered or not. If not, creates a new record for new members
    const updatedMemberDetails = memberDetails.member.map(async (e) => {
      const data = await this.memberRepository.findOne({
        where: { email: e.email },
      });
      if (data) {
        return data;
      }
      const member = this.memberRepository.create({
        name: e.name,
        email: e.email,
      });
      return await this.memberRepository.save(member);
    });

    const memberResult = await Promise.all(updatedMemberDetails);

    const teamMember = this.memberRepository.create(memberResult);

    team.member = await this.memberRepository.save(teamMember);

    return await this.teamRepository.save(team);
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
