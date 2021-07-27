import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {ActivityPlayerSubscription} from "../../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";

@Entity({
    name: "activityPlayers",
})

export class ActivityPlayer{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany( () => ActivityPlayerSubscription, sub => sub.activityPlayer)
    activitySubscriptions: ActivityPlayerSubscription[]
}