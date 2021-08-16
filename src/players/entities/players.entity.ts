import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PlayerWeight} from "../../playersWeights/entities/playersWeights.entity";
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
    height: string

    @Column({
        nullable:true
    })
    photo: string

    @Column('text')
    trainingPlan:string // this is not the subscription plan :d

    @Column('text')
    dietPlan:string

    @Column({type:'smallint', default:0})
    freeze:number

    @Column({type:'smallint', default:0})
    invited:number

    // each player has many subs
    @OneToMany(() => Subscription, sub => sub.player)
    subscriptions: Subscription[]

    @OneToMany(()=>PlayerWeight, playerWeight => playerWeight.player)
    weights: PlayerWeight[]

}
