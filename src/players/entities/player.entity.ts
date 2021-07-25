import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Subscription} from "../../subscriptions/entities/subscription.entity";
import {PlayerWeights} from "../../playersWeights/entities/playersWeights.entity";

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
    trainingPlan:string // this is not the subscription plan :d

    @Column('text')
    dietPlan:string

    // each player has many subs
    @OneToMany(() => Subscription, sub => sub.player)
    subscriptions: Subscription []

    @OneToMany(()=>PlayerWeights, playerWeights=>playerWeights.player)
    weights: PlayerWeights []

}
