import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards, } from "@nestjs/common";
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from "src/dtos/task.dto";
import { AuthGuard } from "@nestjs/passport";
import { TaskService } from "src/services/task.service";


@Controller()
export class TaskController{
    constructor(
        private readonly taskService : TaskService
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Post('/task')
    async createTask(@Body() createTaskDto: CreateTaskDto){
        // console.log(createTaskDto);
        const {description, dueDate, status} = createTaskDto;

        // dueDate should be greater than current date
        if(dueDate<=new Date)
        throw new BadRequestException("Expired Due Date");
    
        return this.taskService.createTask(createTaskDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/assign')
    async assignTask(@Body() assignTaskDto:AssignTaskDto){
        return this.taskService.assignTaskToMember(assignTaskDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/task')
    async getTaskDetails(){
        return this.taskService.getTaskWithAssignee();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/task/:id')
    async updateTask(@Body() updateTaskDto: UpdateTaskDto, @Param('id') id:number){

        if(updateTaskDto.dueDate && updateTaskDto.dueDate<=new Date)
        throw new BadRequestException("Expired Due Date");

        return this.taskService.updateTask(id,updateTaskDto);
    }
}