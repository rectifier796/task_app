import { Team } from './../entities/team.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMemberDto, CreateTeamDto, MemberDto } from 'src/dtos/team.dto';
import { Member } from 'src/entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}


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
    return await this.memberRepository.find({relations:{team:true}});
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

}
