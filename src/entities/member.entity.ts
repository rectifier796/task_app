import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./team.entity";
import { Task } from "./task.entity";


@Entity()
export class Member{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @ManyToOne(()=>Team,(item)=>item.member,{cascade:true})
    team:Team;

    @OneToMany(()=>Task,(task)=>task.member,{cascade:true})
    task:Task
}