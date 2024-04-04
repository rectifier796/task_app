import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, UseGuards, } from "@nestjs/common";
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from "src/dtos/task.dto";
import { AppService } from "src/app.service";
import { AddMemberDto, CreateTeamDto, MemberDto } from "./dtos/team.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller()
export class AppController{
    constructor(
        private readonly appService : AppService
    ){}

    // Endpoint to get jwt token
    @Get('/token')
    async getToken(){
        return this.appService.getToken();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/task')
    async createTask(@Body() createTaskDto: CreateTaskDto){
        // console.log(createTaskDto);
        const {description, dueDate, status} = createTaskDto;

        // dueDate should be greater than current date
        if(dueDate<=new Date)
        throw new BadRequestException("Expired Due Date");
    
        return this.appService.createTask(createTaskDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/team')
    async createTeam(@Body() createTeamDto:CreateTeamDto){
        return this.appService.createTeam(createTeamDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/member')
    async createMember(@Body() memberDto:MemberDto){
        return this.appService.createMember(memberDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/addMember')
    async addMember(@Body() addMemberDto: AddMemberDto){
        // console.log(addMemberDto);
        let {member} = addMemberDto;

        //Should have atleast one member to add
        if(member.length==0)
        throw new BadRequestException("Should have atleast 1 member");

        return this.appService.addMemberToTeam(addMemberDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/member')
    async getAllMember(){
        return this.appService.getAllMember();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/assign')
    async assignTask(@Body() assignTaskDto:AssignTaskDto){
        return this.appService.assignTaskToMember(assignTaskDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/task')
    async getTaskDetails(){
        return this.appService.getTaskWithAssignee();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/task/:id')
    async updateTask(@Body() updateTaskDto: UpdateTaskDto, @Param('id') id:number){
        return this.appService.updateTask(id,updateTaskDto);
    }


    // Endpoint to test jwt token
    @UseGuards(AuthGuard('jwt'))
    @Get('/test')
    async testing(@Req() req:Request){
        // console.log(req);
        return {authorized : true};
    }
}