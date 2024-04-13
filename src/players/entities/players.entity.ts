import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
// import {PlayerWeight} from "../../playersWeights/entities/playersWeights.entity";
import {Subscription} from "../../subscriptions/entities/subscriptions.entity";
import {PtSubscription} from "../../pt/subscrpitions/entities/subscriptions.entity";

@Entity()

export class Player {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({unique: true})
    phoneNumber: string

    @Column({
        nullable:true
    })
    height?: string

    @Column({
        nullable:true
    })
    photo: string

    @Column({
        nullable:true,
        type: "text"
    })
    trainingPlan?:string // this is not the subscription plan :d

    @Column({
        nullable:true,
        type: "text"
    })
    dietPlan?:string

    @Column({type:'smallint', default:0})
    freeze:number

    @Column({type:'smallint', default:0})
    invited:number

    @Column({
        nullable:true,
        type: "varchar", // to fix the type error
        length:255
    })
    barCode: string

    // each player has many subs
    @OneToMany(() => Subscription, sub => sub.player)
    subscriptions: Subscription[]

    @OneToMany(() => PtSubscription, sub => sub.player)
    pt_subscriptions: PtSubscription[]

    // @OneToMany(()=>PlayerWeight, playerWeight => playerWeight.player)
    // weights: PlayerWeight[]

}
