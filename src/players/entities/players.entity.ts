import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscription} from "../../subscriptions/entities/subscriptions.entity";

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

    @Column()
    weight: string

    @Column()
    height: string

    @Column()
    photo: string

    @Column('text')
    trainingPlan:string

    @Column('text')
    dietPlan:string

    // each player has many subs
    @OneToMany(() => Subscription, sub => sub.player)
    subscriptions: Subscription[]

}