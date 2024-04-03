import { PartialType } from "@nestjs/mapped-types";
import { IsDate, IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString, MinDate } from "class-validator";
import { TaskStatus } from "src/enums/data.enum";


export class CreateTaskDto{

    @IsString()
    @IsNotEmpty()
    description : string;

    @IsNotEmpty()
    @IsDate()
    dueDate:Date;

    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status:TaskStatus
}

export class UpdateTaskDto extends PartialType(CreateTaskDto){}

export class AssignTaskDto{

    @IsNotEmpty()
    @IsNumber()
    taskId:number;

    @IsNotEmpty()
    @IsNumber()
    memberId:number;
}