import { link } from "fs";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscription} from "../../subscriptions/entities/subscription.entity";

@Entity({
    name: "players",
})

export class Player {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({unique: true})
    phoneNumber: string

    @Column('double')
    weight: number

    @Column('double')
    height: number

    @Column()
    photo: string

    // ech pl has many subs
    @OneToMany(() => Subscription, sub => sub.player)
    subscriptions: Subscription[]

}
