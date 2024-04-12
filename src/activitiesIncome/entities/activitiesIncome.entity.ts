import { ActivityPlayerSubscription } from "src/activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ActivityIncome{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: Date})
    dayDate: string

    @Column()
    numberOfPlayers: number

    @OneToOne( ()=> ActivityPlayerSubscription, sub => sub.id, {
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager: true
    })
    @JoinColumn()
    activitySubscription: ActivityPlayerSubscription
}