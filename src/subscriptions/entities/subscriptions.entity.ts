import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
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
    beginDate: Date

    @Column({
        type: 'date'
    })
    endDate: Date

    @Column('double')
    price:number

    @ManyToOne( () => Player, player => player.id,{
        onDelete: "CASCADE",
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
}

