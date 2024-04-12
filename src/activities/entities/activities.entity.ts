import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ActivityPlayerSubscription} from "../../activityPlayerSubscriptions/entities/activityPlayerSubscriptions.entity";

@Entity()

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
