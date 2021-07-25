import { Activity } from "src/activities/entities/activity.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {ActivityPlayersSubscription} from "../../activity-playersSubscription/entities/activity-playersSubscription.entity";

@Entity({
    name: "activity-player",
})

export class ActivityPlayer{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
    
    @Column({type: 'date'})
    beginDate: Date

    @Column({type: 'date'})
    endDate: Date

    @OneToMany( () => ActivityPlayersSubscription, sub => sub.activityPlayer)
    activitySubscriptions: ActivityPlayersSubscription[]
}