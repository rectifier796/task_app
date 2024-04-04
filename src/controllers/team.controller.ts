import { BadRequestException, Body, Controller, Get, Post, UseGuards, } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AddMemberDto, CreateTeamDto, MemberDto } from "src/dtos/team.dto";
import { TeamService } from "src/services/team.service";


@Controller()
export class TeamController{
    constructor(
        private readonly teamService : TeamService
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Post('/team')
    async createTeam(@Body() createTeamDto:CreateTeamDto){
        return this.teamService.createTeam(createTeamDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/member')
    async createMember(@Body() memberDto:MemberDto){
        return this.teamService.createMember(memberDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/addMember')
    async addMember(@Body() addMemberDto: AddMemberDto){
        // console.log(addMemberDto);
        let {member} = addMemberDto;

        //Should have atleast one member to add
        if(member.length==0)
        throw new BadRequestException("Should have atleast 1 member");

        return this.teamService.addMemberToTeam(addMemberDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/member')
    async getAllMember(){
        return this.teamService.getAllMember();
    }
}