import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {ActivityPlayerSubscription} from "../../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";

@Entity()

export class ActivityPlayer{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    phoneNumber: string
    
    @OneToMany( () => ActivityPlayerSubscription, sub => sub.activityPlayer)
    activitySubscriptions: ActivityPlayerSubscription[]
}