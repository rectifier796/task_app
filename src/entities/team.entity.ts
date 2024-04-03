import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";


@Entity()
export class Team{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    name:string;
    
    @OneToMany(()=>Member,(member)=>member.team)
    member:Member[]

}