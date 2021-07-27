import { Activity } from "src/activities/entities/activity.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {ActivityPlayerSubscription} from "../../activity-playersSubscription/entities/activity-playersSubscription.entity";

@Entity({
    name: "activity-player",
})

export class ActivityPlayer{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @OneToMany( () => ActivityPlayerSubscription, sub => sub.activityPlayer)
    activitySubscriptions: ActivityPlayerSubscription[]
}