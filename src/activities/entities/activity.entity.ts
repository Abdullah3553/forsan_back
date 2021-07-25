import { ActivityPlayer } from "src/activity-players/entities/activity-player.entity";
import {Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ActivityPlayerSubscription} from "../../activity-playersSubscription/entities/activity-playersSubscription.entity";

@Entity({
    name: "activities",
})

export class Activity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    coachName: string

    @Column({unique: true})
    coachPhoneNumber: string

    @Column('double')
    price: number

    @Column('text')
    description: string

    @OneToMany( () => ActivityPlayerSubscription, sub => sub.activity)
    activitySubscriptions: ActivityPlayerSubscription[]
}
