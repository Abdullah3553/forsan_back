import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Plan} from "../../plans/entities/plans.entity";
import {Player} from "../../players/entities/players.entity";

@Entity({
    name: 'subscriptions'
})

export class Subscription {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'date'
    })
    beginDate: string

    @Column({
        type: 'date'
    })
    endDate: string | Date

    @Column('double')
    payedMoney:number

    @Column('date')
    creationDate:string

    //Relations :-

    @ManyToOne( () => Player, player => player.id,{
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
        eager:false
    })
    @JoinColumn()
    player: Player

    @ManyToOne( () => Plan, plan => plan.id ,{
        onDelete: "SET NULL",
        eager: true
    })
    @JoinColumn()
    plan: Plan

    // @OneToOne( () => SubscriptionIncome, subscriptionIncome => subscriptionIncome.id)
    // subscriptionIncome: SubscriptionIncome
}

