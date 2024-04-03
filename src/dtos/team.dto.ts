import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested, isString } from "class-validator";
import { Member } from "src/entities/member.entity";


export class CreateTeamDto{
    @IsNotEmpty()
    @IsString()
    name:string;
}

export class MemberDto{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsEmail()
    email:string;
}

export class AddMemberDto{
    @IsNotEmpty()
    @IsString()
    teamName:string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>MemberDto)
    member : MemberDto[];

}